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

'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const path = require('path');
const glob = require('glob');

function bundleJS(fullFilePath) {
  const browserifyBundles = browserify({
    entries: fullFilePath
  });

  // Rollupify reduces the size of the final output but increases build
  // time to do it so enable for production build only
  if (GLOBAL.config.env === 'prod') {
    browserifyBundles.transform('rollupify');
  }

  let stream = browserifyBundles
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  // `source` Converts Browserify's Node Stream to a Gulp Stream
  // Use path.relative to make the file have the correct home in `dest`
  .pipe(
    source(path.join('.', path.relative(GLOBAL.config.src, fullFilePath)))
  )
  .pipe(buffer())
  .pipe(sourcemaps.init());

  if (GLOBAL.config.env === 'prod') {
    stream = stream.pipe(uglify());
  }

  return stream.pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(GLOBAL.config.dest));
}

function build() {
  const globResponse = glob.sync(GLOBAL.config.src + '/**/*.js', {
    dot: false
  });

  const buildPromise = globResponse.reduce((promise, filePath) => {
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        bundleJS(filePath)
        .on('error', reject)
        .on('end', () => resolve());
      });
    });
  }, Promise.resolve());

  return buildPromise;
}

module.exports = {
  build: build
};
