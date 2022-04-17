import glob from 'fast-glob';
import { writeFile } from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

import { defineConfig, Plugin } from 'rollup';

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

// always required plugins
const PLUGINS_BASE: Plugin[] = [
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
  resolve(),
  html({
    meta: [{ name: 'viewport', content: 'width=device-width, user-scalable=no' }],
    publicPath: '/',
    title: 'Alfreds Memory',
  }),
  sass({ processor: css => postcss([autoprefixer]).process(css, { from: undefined }) }),
  typescript(),
];

// plugins for production
const PLUGINS_PROD: Plugin[] = [
  minifyHTML(),
  terser({
    ecma: 2020,
    module: true,
  }),
];

// plugins for watch mode
const PLUGINS_WATCH: Plugin[] = [
  serve({
    contentBase: 'dist',
    historyApiFallback: true,
    port: 3000,
  }),
];

// combine relevant plugins
let PLUGINS_COMBINED: Plugin[] = [...PLUGINS_BASE];
if (isProd) {
  PLUGINS_COMBINED = [...PLUGINS_COMBINED, ...PLUGINS_PROD];
}
if (isWatch) {
  PLUGINS_COMBINED = [...PLUGINS_COMBINED, ...PLUGINS_WATCH];
}

export default defineConfig({
  input: 'src/index.ts',
  output: { dir: 'dist' },
  onwarn(message, next) {
    if (message.code && SKIP_WARNINGS.includes(message.code)) {
      return;
    }
    next(message);
  },
  plugins: PLUGINS_COMBINED,
  preserveEntrySignatures: 'strict',
});
