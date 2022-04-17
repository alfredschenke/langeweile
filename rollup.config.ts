import glob from 'fast-glob';
import { writeFile } from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

import { defineConfig, Plugin } from 'rollup';

import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import copy from 'rollup-plugin-copy';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';

const SKIP_WARNINGS = ['CIRCULAR_DEPENDENCY', 'EVAL', 'THIS_IS_UNDEFINED', 'UNRESOLVED_IMPORT'];

export default defineConfig({
  input: 'src/index.ts',
  output: { dir: 'dist' },
  onwarn(message, next) {
    if (message.code && SKIP_WARNINGS.includes(message.code)) {
      return;
    }
    next(message);
  },
  plugins: [
    copy({
      targets: [
        {
          src: 'src/_redirects',
          dest: 'dist/',
        },
        {
          src: 'src/assets/*',
          dest: 'dist/assets',
        },
        {
          src: 'node_modules/@fontsource/roboto-condensed/files/*',
          dest: 'dist/assets/fonts/roboto-condensed',
        },
      ],
    }),
    {
      name: 'store-image-list',
      generateBundle: async () => {
        const sources = await glob('src/assets/images/memory/*.jpg');
        const images = sources.map(source => source.replace(/^src/, ''));
        await writeFile('./dist/assets/images/memory.json', JSON.stringify(images));
      },
    } as Plugin,
    resolve(),
    html({
      meta: [{ name: 'viewport', content: 'width=device-width, user-scalable=no' }],
      title: 'Alfreds Memory',
    }),
    sass({ processor: css => postcss([autoprefixer]).process(css, { from: undefined }) }),
    typescript(),
    minifyHTML(),
    terser({
      ecma: 2020,
      module: true,
    }),
  ],
  preserveEntrySignatures: 'strict',
});
