import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const { homepage, name, version, module } = JSON.parse(readFileSync('./package.json'));


const banner = `/*!
 * @license
 * ${name}
 * ${homepage}
 * Version: ${version}
 *
 * Copyright ${new Date().getFullYear()} Chart.js Contributors
 * Released under the MIT license
 * https://github.com/thienvu18/chartjs-gauge/blob/master/LICENSE.md
 */`;

export default [
  {
    input: 'src/index.js',
    output: ['dist', 'docs'].flatMap(folder => ['js', 'min.js'].map((suffix) => {
      const config = {
        name: 'Chart.Gauge',
        file: `${folder}/${name}.${suffix}`,
        banner: banner,
        format: 'umd',
        indent: false,
        plugins: [],
        globals: {
          'chart.js': 'Chart',
        },
      };

      if (suffix.match(/\.min\.js$/)) {
        config.plugins.push(
          terser(),
        );
      }

      return config;
    }), []),
    plugins: [],
    external: [
      'chart.js',
    ],
  },
  {
    input: 'src/index.esm.js',
    output: {
      file: module,
      banner: banner,
      format: 'esm',
      indent: false,
    },
    external: [
      'chart.js',
    ],
  },
];
