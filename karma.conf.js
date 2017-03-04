'use strict';

const webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'test/entry.ts'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/entry.ts': ['webpack', 'sourcemap']
    },

    webpack: {
      resolve: {
        extensions: ['', '.ts', '.js'],
        alias: {
          sinon: 'sinon/pkg/sinon'
        }
      },
      module: {
        preLoaders: [{
          test: /\.ts$/, loader: 'tslint-loader', exclude: /node_modules/
        }],
        loaders: [{
          test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: /node_modules/
        }, {
          test: /sinon.js$/, loader: 'imports-loader?define=>false,require=>false'
        }],
        postLoaders: [{
          test: /src\/.+\.ts$/,
          exclude: /(test|node_modules)/,
          loader: 'istanbul-instrumenter-loader'
        }]
      },
      tslint: {
        emitErrors: config.singleRun,
        failOnHint: false
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        })
      ].concat(config.singleRun ? [new webpack.NoErrorsPlugin()] : [])
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS']
  });
};
