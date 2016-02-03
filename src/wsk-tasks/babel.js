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
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rollup = require('gulp-rollup');
var sourcemaps = require('gulp-sourcemaps');

function build() {
  var stream = gulp.src(GLOBAL.config.src + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(rollup())
    .pipe(babel({
      presets: ['es2015']
    }));

  if (GLOBAL.config.env === 'prod') {
    stream = stream.pipe(uglify());
  }

  return stream.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(GLOBAL.config.dest));
}

module.exports = {
  build: build,
};
