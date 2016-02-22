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
const htmlmin = require('gulp-htmlmin');
const inlineSource = require('gulp-inline-source');

function build() {
  let stream = gulp.src(GLOBAL.config.src + '/**/*.html');

  // We only want to minify for production builds
  if (GLOBAL.config.env === 'prod') {
    stream = stream.pipe(inlineSource({
      attribute: 'data-inline',
      compress: false,
      rootpath: GLOBAL.config.dest
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }));
  }

  return stream.pipe(gulp.dest(GLOBAL.config.dest));
}

function watch() {
  return gulp.watch(GLOBAL.config.src + '/**/*.html', build);
}

module.exports = {
  build: build,
  watch: watch
};
