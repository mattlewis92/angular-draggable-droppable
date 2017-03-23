import * as path from 'path';

const webpackAngularExternals = require('webpack-angular-externals');
const webpackRxjsExternals = require('webpack-rxjs-externals');

export default {
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist', 'umd'),
    filename: './angular-draggable-droppable.js',
    libraryTarget: 'umd',
    library: 'angularDraggableDroppable'
  },
  externals: [
    webpackAngularExternals(),
    webpackRxjsExternals()
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'tslint-loader?emitErrors=true&failOnHint=true',
      exclude: /node_modules/,
      enforce: 'pre'
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
