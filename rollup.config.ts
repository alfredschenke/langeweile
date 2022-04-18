import glob from 'fast-glob';
import { writeFile } from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

import { defineConfig, Plugin } from 'rollup';

import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

const isProd = process.argv.includes('--prod');
const isWatch = process.argv.includes('--watch');

// rollup warnings to ignore
const SKIP_WARNINGS = ['CIRCULAR_DEPENDENCY', 'EVAL', 'THIS_IS_UNDEFINED', 'UNKNOWN_OPTION', 'UNRESOLVED_IMPORT'];

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
    del({
      runOnce: true,
      targets: 'dist',
    }),
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
        const images = sources.map(source => source.replace('src', ''));
        await writeFile('dist/assets/images/memory.json', JSON.stringify(images));
      },
    } as Plugin,
    commonjs(),
    resolve(),
    html({
      meta: [{ name: 'viewport', content: 'width=device-width, user-scalable=no' }],
      publicPath: '/',
      title: 'Alfreds Langeweile',
    }),
    sass({ processor: css => postcss([autoprefixer]).process(css, { from: undefined }) }),
    typescript(),

    isProd && minifyHTML(),
    isProd &&
      terser({
        ecma: 2020,
        module: true,
      }),

    isWatch &&
      serve({
        contentBase: 'dist',
        historyApiFallback: true,
        port: 3000,
      }),
  ],
  preserveEntrySignatures: 'strict',
});
