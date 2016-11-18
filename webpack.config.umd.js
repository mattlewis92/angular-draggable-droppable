const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist', 'umd'),
    filename: './angular-draggable-droppable.js',
    libraryTarget: 'umd',
    library: 'angularDraggableDroppable'
  },
  externals: {
    '@angular/core': {
      root: ['ng', 'core'],
      commonjs: '@angular/core',
      commonjs2: '@angular/core',
      amd: '@angular/core'
    },
    '@angular/common': {
      root: ['ng', 'common'],
      commonjs: '@angular/common',
      commonjs2: '@angular/common',
      amd: '@angular/common'
    },
    'rxjs/Subject': {
      root: ['rx', 'Subject'],
      commonjs: 'rxjs/Subject',
      commonjs2: 'rxjs/Subject',
      amd: 'rxjs/Subject'
    },
    'rxjs/Observable': {
      root: ['rx', 'Observable'],
      commonjs: 'rxjs/Observable',
      commonjs2: 'rxjs/Observable',
      amd: 'rxjs/Observable'
    },
    'rxjs/add/observable/merge': {
      root: ['rx', 'Observable', 'merge'],
      commonjs: 'rxjs/add/observable/merge',
      commonjs2: 'rxjs/add/observable/merge',
      amd: 'rxjs/add/observable/merge'
    },
    'rxjs/add/operator/map': {
      root: ['rx', 'Observable'],
      commonjs: 'rxjs/add/operator/map',
      commonjs2: 'rxjs/add/operator/map',
      amd: 'rxjs/add/operator/map'
    },
    'rxjs/add/operator/mergeMap': {
      root: ['rx', 'Observable'],
      commonjs: 'rxjs/add/operator/mergeMap',
      commonjs2: 'rxjs/add/operator/mergeMap',
      amd: 'rxjs/add/operator/mergeMap'
    },
    'rxjs/add/operator/takeUntil': {
      root: ['rx', 'Observable'],
      commonjs: 'rxjs/add/operator/takeUntil',
      commonjs2: 'rxjs/add/operator/takeUntil',
      amd: 'rxjs/add/operator/takeUntil'
    },
    'rxjs/add/operator/takeLast': {
      root: ['rx', 'Observable'],
      commonjs: 'rxjs/add/operator/takeLast',
      commonjs2: 'rxjs/add/operator/takeLast',
      amd: 'rxjs/add/operator/takeLast'
    }
  },
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.ts$/, loader: 'tslint-loader?emitErrors=true&failOnHint=true', exclude: /node_modules/
    }],
    loaders: [{
      test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  }
};
