/**
 *
 *  Web Starter Kit
 *  Copyright 2016 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'ie_mob >= 10',
  'last 2 ff versions',
  'last 2 chrome versions',
  'last 2 edge versions',
  'last 2 safari versions',
  'last 2 opera versions',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

function build() {
  var sassStream = gulp.src(GLOBAL.config.src + '/**/*.scss')
    .pipe(gulpSass().on('error', gutil.log('error occured with sass')))
    .pipe(sourcemaps.init().on('error', gutil.log('error occured with sass')))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS)
      .on('error', gutil.log('error occured with sass')));

  // We only want to minify for production builds
  if (GLOBAL.config.env === 'prod') {
    sassStream = sassStream.pipe(cssnano()
      .on('error', gutil.log('error occured with sass')));
  }

  return sassStream.pipe(sourcemaps.write('.')
      .on('error', gutil.log('error occured with sass')))
    .pipe(gulp.dest(GLOBAL.config.dest)
      .on('error', gutil.log('error occured with sass')));
}

function watch() {
  return gulp.watch(GLOBAL.config.src + '/**/*.scss', build);
}

module.exports = {
  build: build,
  watch: watch
};
