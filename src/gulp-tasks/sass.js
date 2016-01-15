/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
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

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';

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

gulp.task('sass', () => {
  var sassStream = gulp.src(GLOBAL.config.src + '/**/*.scss')
    .pipe(sass().on('error', sass.logError));

  sassStream = sassStream.pipe(sourcemaps.init());
  sassStream = sassStream.pipe(autoprefixer(AUTOPREFIXER_BROWSERS));

  if (GLOBAL.config.env === 'prod') {
    sassStream = sassStream.pipe(cssnano());
  }

  sassStream = sassStream.pipe(sourcemaps.write(GLOBAL.config.dest));
  return sassStream.pipe(gulp.dest(GLOBAL.config.dest));
});
