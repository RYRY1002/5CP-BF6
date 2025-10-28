import * as esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' };

const banner = `// @ts-nocheck
/*
${pkg.name} ${pkg.version} | (c) ${pkg.author.name}

This is the bundled, minified and comment-stripped output of a TypeScript project.
Go to ${pkg.repository.url} to view the original source code.
*/`;
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    banner: {
        js: banner
        
    },
    minify: true,
    //external: ["modlib"]
})