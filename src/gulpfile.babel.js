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

var gulp = require('gulp');
var sass = require('./wsk-tasks/sass.js');

GLOBAL.config = {
  env: 'prod',
  src: 'src',
  dest: 'build'
};

gulp.task('watch', gulp.series([
  gulp.parallel([sass.build]),
  gulp.parallel([sass.watch])
]));

gulp.task('default', gulp.series([
  gulp.parallel([sass.build])
]));
