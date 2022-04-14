import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'rollup';

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
          src: 'node_modules/@fontsource/roboto-condensed/files/*',
          dest: 'dist/assets/fonts/roboto-condensed',
        },
      ],
    }),
    resolve(),
    html({ title: 'Alfreds Memory' }),
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
