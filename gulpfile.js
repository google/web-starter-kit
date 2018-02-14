/**
 *
 *  Web Starter Kit
 *  Copyright 2018 Google Inc. All rights reserved.
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
const gulp = require('gulp');
const path = require('path');
const fse = require('fs-extra');
const getTaskFilepaths = require('./gulp-tasks/utils/get-task-filepaths');

global.__buildConfig = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'build'),
};

const loadTasks = () => {
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {task} = require(taskFilepath);
    if (task) {
      gulp.task(task);
    }
  }
};

loadTasks();

gulp.task('dev', (done) => {
  return gulp.series([
    'build',
    gulp.parallel([
      'watch',
      'serve',
    ]),
  ])(done);
});

gulp.task('prod', (done) => {
  process.env.NODE_ENV = 'production';

  return gulp.series([
    'build',
    'serviceWorker',
    gulp.parallel([
      'watch',
      'serve',
    ]),
  ])(done);
});
