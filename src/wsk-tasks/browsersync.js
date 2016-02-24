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
const browserSync = require('browser-sync').create();
const path = require('path');
const fs = require('fs');
const taskHelper = require('./task-helper');

function watch() {
  return new Promise(resolve => {
    // Make the reload method globally available
    GLOBAL.config.reload = () => {
      browserSync.reload();
      return Promise.resolve();
    };

    // Start browsersync server
    browserSync.init({
      notify: false,
      server: {
        baseDir: GLOBAL.config.dest
      },
      port: 3000,
      // Customize the Browsersync console logging prefix
      logPrefix: 'WSK',
      // Change to false if you don't want the browser to open when run
      open: true,
      // You can enable local proxies by uncommenting the line below and
      // setting to your own path
      // proxy: "yourlocal.dev"
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true
    });

    // Register watch tasks
    const allTasks = taskHelper.getTasks();
    allTasks.map(taskInfo => {
      if (taskInfo.filename === 'browsersync.js') {
        return;
      }

      var task = require(taskInfo.path);
      if (task.watch) {
        task.watch();
      }
    });

    resolve();
  });
}

module.exports = {
  watch: watch
};
