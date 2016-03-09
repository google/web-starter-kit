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
const path = require('path');
const fs = require('fs');

const performWatch = (pathsToWatch, tasksToPerform) => {
  if (!Array.isArray(tasksToPerform)) {
    throw new Error('performWatch() expects an array of functions');
  }

  const watchFunctions = tasksToPerform;

  // Add the browsersync reload function to the chain if it's available
  if (GLOBAL.config.reload) {
    watchFunctions.push(GLOBAL.config.reload);
  }

  return gulp.watch(pathsToWatch, gulp.series(watchFunctions));
};

const getTasks = () => {
  const tasksDirectory = path.join(__dirname, '..', '..', 'src', 'wsk-tasks');
  let taskFilenames = fs.readdirSync(tasksDirectory);
  const taskHelperIndex = taskFilenames.indexOf('task-helper.js');
  if (taskHelperIndex !== -1) {
    taskFilenames.splice(taskHelperIndex, 1);
  }
  return taskFilenames.map(taskFilename => {
    return {
      filename: taskFilename,
      path: path.join(tasksDirectory, taskFilename)
    };
  });
};

module.exports = {
  performWatch: performWatch,
  getTasks: getTasks
};
