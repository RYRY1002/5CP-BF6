import * as esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' };

const banner = `// @ts-nocheck
/*
${pkg.name} ${pkg.version} | (c) ${pkg.author.name} | ${pkg.repository.url}
*/`;
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    banner: {
        js: banner
        
    },
})