#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const HEADER_IGNORE_LINE_COUNT = 6;

function usageAndExit() {
  console.error('Usage: node scripts/merge-comments.js <file>');
  process.exit(1);
}

function readFilePreserveEOL(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const EOL = content.includes('\r\n') ? '\r\n' : '\n';
  return { content, EOL };
}

function isTripleSlash(line) {
  return /^\s*\/\/\/(?!\/)/.test(line);
}

function isIgnoredDirectiveText(text) {
  const t = (text || '').trim();
  return /^eslint\b/i.test(t) || /^export\b/i.test(t);
}

// Returns true when the text (after //) contains only hyphens or slashes with optional whitespace
function isPureHyphenOrSlashText(text) {
  const t = (text || '').replace(/\s+/g, '');
  // Allow -, forward slash /, and backslash \
  return t.length > 0 && /^[-/\\]+$/.test(t);
}

function mergeLineCommentsIntoFollowingJSDoc(lines, ignoreFirstN = HEADER_IGNORE_LINE_COUNT) {
  const out = [];
  let changed = false;
  let merges = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Do not transform within the header-ignore window
    if (i < ignoreFirstN) {
      out.push(line);
      continue;
    }

    // Detect a whole-line // comment
    const m = /^(\s*)\/\/\s?(.*)$/.exec(line);
    if (!m) {
      out.push(line);
      continue;
    }

    // Collect contiguous //-comment lines and check for ignored directives
    const commentLines = [m[2]];
    let j = i + 1;
    let blockHasIgnored =
      isIgnoredDirectiveText(m[2]) ||
      isTripleSlash(line) ||
      isPureHyphenOrSlashText(m[2]);

    while (j < lines.length) {
      const l = lines[j];
      const mm = /^(\s*)\/\/\s?(.*)$/.exec(l);
      if (mm) {
        commentLines.push(mm[2]);
        if (
          isIgnoredDirectiveText(mm[2]) ||
          isTripleSlash(l) ||
          isPureHyphenOrSlashText(mm[2])
        ) {
          blockHasIgnored = true;
        }
        j++;
        continue;
      }
      break;
    }

    // If any line in the block is ignored, emit originals and skip merging
    if (blockHasIgnored) {
      for (let p = i; p < j; p++) out.push(lines[p]);
      i = j - 1;
      continue;
    }

    // Skip blank lines between the comment block and a JSDoc opener
    let k = j;
    while (k < lines.length && /^\s*$/.test(lines[k])) {
      k++;
    }

    // Detect a JSDoc opener strictly as a bare '/**' line
    const open = k < lines.length ? /^(\s*)\/\*\*\s*$/.exec(lines[k]) : null;

    if (open) {
      const jsdocIndent = open[1];

      // Find the end of the JSDoc block
      let end = k + 1;
      while (end < lines.length && !/^\s*\*\/\s*$/.test(lines[end])) {
        end++;
      }
      if (end >= lines.length) {
        // Malformed JSDoc; keep original lines untouched
        for (let p = i; p < j; p++) out.push(lines[p]);
        i = j - 1;
        continue;
      }

      // Write merged JSDoc
      out.push(jsdocIndent + '/**');
      for (const c of commentLines) {
        const text = (c || '').replace(/\s+$/g, '').trim();
        out.push(jsdocIndent + ' * ' + text);
      }

      // Append the original JSDoc content including the closing */
      for (let t = k + 1; t <= end; t++) {
        out.push(lines[t]);
      }

      changed = true;
      merges++;
      // Skip consumed portion
      i = end; // for-loop i++ advances to the line after '*/'
      continue;
    }

    // No merge target; emit original lines
    for (let p = i; p < j; p++) out.push(lines[p]);
    i = j - 1;
  }

  return { lines: out, changed, merges };
}

function convertWholeLineCommentsToJSDoc(lines, ignoreFirstN = HEADER_IGNORE_LINE_COUNT) {
  const out = [];
  let changed = false;
  let convertedBlocks = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Do not transform within the header-ignore window
    if (i < ignoreFirstN) {
      out.push(line);
      continue;
    }

    // Match whole-line // comment
    const m = /^(\s*)\/\/\s?(.*)$/.exec(line);
    if (!m) {
      out.push(line);
      continue;
    }

    const indent = m[1];
    const firstText = m[2];

    // Preserve triple-slash reference or directives (/// ...)
    if (isTripleSlash(line)) {
      out.push(line);
      continue;
    }

    // Collect contiguous // comment lines to form a block JSDoc
    const texts = [firstText];
    let j = i + 1;
    let abortBlock =
      isIgnoredDirectiveText(firstText) ||
      isPureHyphenOrSlashText(firstText); // starts with eslint/export or pure hyphen/slash
    while (j < lines.length) {
      // Stop collecting if next line falls into ignore window (safety)
      if (j < ignoreFirstN) break;

      const mmLine = lines[j];
      const mm = /^(\s*)\/\/\s?(.*)$/.exec(mmLine);
      if (mm) {
        if (
          isTripleSlash(mmLine) ||
          isIgnoredDirectiveText(mm[2]) ||
          isPureHyphenOrSlashText(mm[2])
        ) {
          abortBlock = true;
          break;
        }
        texts.push(mm[2]);
        j++;
      } else {
        break;
      }
    }

    // If the block contains ignored directives or pure hyphen/slash lines, emit original lines and skip conversion
    if (abortBlock) {
      // emit the original contiguous // block unchanged
      let p = i;
      while (p < lines.length) {
        const mm = /^(\s*)\/\/\s?(.*)$/.exec(lines[p]);
        if (!mm) break;
        out.push(lines[p]);
        p++;
      }
      i = p - 1;
      continue;
    }

    // If every line is effectively empty, keep original lines as-is
    const nonEmpty = texts.some(t => t.trim().length > 0);
    if (!nonEmpty) {
      for (let p = i; p < j; p++) out.push(lines[p]);
      i = j - 1;
      continue;
    }

    // Sanitize to avoid prematurely closing the block comment
    const sanitize = (s) => s.replace(/\*\//g, '*\\/').trimEnd();

    if (texts.length === 1) {
      const text = sanitize(texts[0]).trim();
      out.push(text.length > 0 ? `${indent}/** ${text} */` : `${indent}/** */`);
    } else {
      out.push(indent + '/**');
      for (const t of texts) {
        const txt = sanitize(t).trim();
        out.push(indent + ' * ' + txt);
      }
      out.push(indent + ' */');
    }

    changed = true;
    convertedBlocks++;
    i = j - 1; // skip consumed
  }

  return { lines: out, changed, convertedBlocks };
}

function main() {
  const targetPath = process.argv[2];
  if (!targetPath) usageAndExit();

  const filePath = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const { content: original, EOL } = readFilePreserveEOL(filePath);
  const initialLines = original.split(/\r?\n/);

  // Pass 1: Merge // comment blocks into following JSDoc blocks
  const mergeRes = mergeLineCommentsIntoFollowingJSDoc(initialLines, HEADER_IGNORE_LINE_COUNT);

  // Pass 2: Convert remaining whole-line // comments into JSDoc
  const convertRes = convertWholeLineCommentsToJSDoc(mergeRes.lines, HEADER_IGNORE_LINE_COUNT);

  const result = convertRes.lines.join(EOL);

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
  }

  const messages = [];
  if (mergeRes.merges) messages.push(`Merged ${mergeRes.merges} block(s)`);
  if (convertRes.convertedBlocks) messages.push(`converted ${convertRes.convertedBlocks} block(s)`);
  messages.push(`ignored first ${HEADER_IGNORE_LINE_COUNT} line(s)`);
  messages.push('ignored ESLint directives, comments starting with "export", and pure hyphen/slash comments');
  const summary = messages.join(', ');
  console.log(`${summary}: ${path.relative(process.cwd(), filePath)}`);
}

if (require.main === module) {
  main();
}