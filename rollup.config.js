import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const input =
  'dist/angular-draggable-droppable/bundles/angular-draggable-droppable.umd.js';

// bundle dom-autoscroller lib so it's not a breaking change for systemjs users
const base = {
  input,
  output: {
    file: input,
    format: 'umd',
    name: 'angular-draggable-droppable',
    sourcemap: true,
    globals: {
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operators',
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common'
    }
  },
  plugins: [resolve({ module: true }), commonjs()],
  external: ['@angular/core', '@angular/common', 'rxjs', 'rxjs/operators']
};

export default [
  base,
  {
    ...base,
    output: {
      ...base.output,
      file: base.output.file.replace('.js', '.min.js')
    },
    plugins: [...base.plugins, terser()]
  }
];
