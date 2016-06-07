'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const minPostfix = isProduction ? '.min' : '';
const minify = isProduction ? 'minimize' : '';
const hash = '[hash:7]';

const entry = './app/js/entry.js';
const devEntry = [
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client?reload=true',
  entry,
];
const basePlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  new ExtractTextPlugin(`css/style.${hash}${minPostfix}.css`, {
    allChunks: true
  }),
  new HTMLWebpackPlugin({
    title: 'Web Starter Kit for Amaze UI',
    template: 'app/index.html',
    inject: false,
    prod: isProduction,
    AMUICDN: isProduction ? 'https://cdnjs.cloudflare.com/ajax/libs/amazeui/2.7.0/' : '',
    minify: isProduction ? {
      removeComments: true,
      collapseWhitespace: true
    } : null,
  }),
];
const envPlugins = isProduction ? [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.BannerPlugin(`build: ${new Date().toString()}`),
] : [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // @see https://www.npmjs.com/package/eslint-loader#noerrorsplugin
  new webpack.NoErrorsPlugin(),
];

module.exports = {
  debug: !isProduction,
  devtool: !isProduction ? '#eval' : null,

  entry: isProduction ? entry : devEntry,

  output: {
    path: path.join(__dirname, 'dist'),
    filename: `js/app.${hash}${minPostfix}.js`,
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          // 'eslint',
        ],
        include: [
          path.join(__dirname, 'app/js')
        ]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style',
          `css?${minify}!postcss!less`
        ),
        include: [
          path.join(__dirname, 'app/less')
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png|\.ico$/,
        loaders: [
          'file?name=[path][name].[ext]&context=app',
          'image-webpack'
          ]
      },
      {
        test: /\.txt$|\.json$|\.webapp$/,
        loader: 'file?name=[path][name].[ext]&context=app'
      },
    ]
  },

  plugins: basePlugins.concat(envPlugins),

  externals: {
    'jquery': 'jQuery',
    'amazeui': 'AMUI'
  },

  // watch: !isProduction,

  // loader config
  postcss: [autoprefixer({browsers: ['> 1%', 'last 2 versions']})],

  // @see https://www.npmjs.com/package/image-webpack-loader
  imageWebpackLoader: {}
};
