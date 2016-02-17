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

/* eslint-env node, mocha */

'use strict';

require('chai').should();

const fs = require('fs');
const path = require('path');
const del = require('del');
const ncp = require('ncp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const taskHelper = require('./helpers/task-helper');

const VALID_TEST_FILES = path.join('test', 'data', 'valid-files');
const INVALID_TEST_FILES = path.join('test', 'data', 'invalid-files');
const VALID_TEST_FILES_2 = path.join('test', 'data', 'valid-files-2');
const TEST_OUTPUT_PATH = path.join('test', 'output');
const TEST_OUTPUT_SRC = path.join(TEST_OUTPUT_PATH, 'src');
const TEST_OUTPUT_DEST = path.join(TEST_OUTPUT_PATH, 'build');

let watcherTaskId = 0;
let watcherTask;

const copyFiles = (from, to) => {
  return new Promise((resolve, reject) => {
    ncp(from, to, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

const validateOutput = () => {
  // console.log('validateOutput');
  // Get directories in build directory
  const folders = fs.readdirSync(TEST_OUTPUT_DEST);
  folders.forEach(folderName => {
    try {
      // Check if the source directory lives, if it doesn't we can ignore
      // the remaining output (i.e. old stuff that needs cleaning out)
      // console.log('Running lstat');
      fs.lstatSync(path.join(TEST_OUTPUT_SRC, folderName));
    } catch (err) {
      // Path doesn't exist, we can ignore it
      return;
    }

    const expectedOutputFileBuffer = fs.readFileSync(path.join(TEST_OUTPUT_SRC, folderName, 'output.json'));
    const expectedOutput = JSON.parse(expectedOutputFileBuffer.toString());
    expectedOutput.forEach(file => {
      const fullpath = path.join(TEST_OUTPUT_DEST, folderName, file);
      console.log('lstat');
      const pathstats = fs.lstatSync(fullpath);
      if (!pathstats) {
        throw new Error(`Expected output file could not be found: ${fullpath}`);
      }

      if (pathstats.size <= 0) {
        throw new Error(`Output file has no contents: ${fullpath}`);
      }
    });
  });
};

const runSteps = (taskName, task, steps) => {
  return new Promise((resolve, reject) => {
    // Create path to puth files into
    let stepIndex = 0;
    let currentTimeout = null;

    // Start Watching
    watcherTaskId++;
    watcherTask = task.watch();
    if (!watcherTask) {
      reject(new Error(`Nothing returned from the tasks watch() method. Is the result of gulp.watch returned in ${taskName}`));
      return;
    }

    watcherTask._customId = watcherTaskId;

    // Listen to events to detect when changes are handled and add a short delay
    // to give task time to complete
    watcherTask.on('all', (event) => {
      console.log('Watch Event: ', event, watcherTask._customId);
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      console.log('Watch Event: Step 1', event, watcherTask._customId);

      currentTimeout = setTimeout(() => {
        console.log('Watch Event: Step 3 (Timeout)', event, watcherTask._customId);
        if (stepIndex === (steps.length - 1)) {
          console.log('Steps Finished - Closing Watcher ' + watcherTask._customId);
          resolve();
          return;
        }

        stepIndex++;
        steps[stepIndex]();
      }, 6000);

      console.log('Watch Event: Step 2', event, watcherTask._customId);
    });

    // Listen for when to start changes to files
    watcherTask.on('ready', steps[stepIndex]);
  })
  .then(function() {
    console.log('Promise Has Finished');
    if (watcherTask) {
      watcherTask.close();
      watcherTask = null;
    }
  })
  .then(validateOutput);
};

const registerTestsForTask = (taskName, task) => {
  describe(`${taskName}`, function() {
    it('should watch for new files being added to empty directory', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC)
      ];

      return runSteps(taskName, task, steps);
    });

    it('should watch for new files being added and changed', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC)
      ];

      return runSteps(taskName, task, steps);
    });

    it('should watch for new files being added and deleted', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => del(TEST_OUTPUT_SRC + '/*')
      ];

      return runSteps(taskName, task, steps)
        .catch(err => {
          console.log('Error from Task', err);
          throw err;
        });
    });

    it('should watch for new files being added, followed by bad example files followed by the original files', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC)
      ];

      return runSteps(taskName, task, steps);
    });

    it('should watch for new files being added, followed by bad example files followed by the differnt valid files', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC)
      ];

      return runSteps(taskName, task, steps);
    });
  });
};

describe('Run tests against watch methods', function() {
  // Clean up before each test
  beforeEach(done => {
    console.log('beforeEach Step 1');
    if (watcherTask) {
      console.log('Watcher task .close()');
      watcherTask.close();
      watcherTask = null;
    }
    console.log('beforeEach Step 2');

    // Use rimraf over del because it seems to work more reliably on Windows.
    // Probably due to it's retries.
    rimraf(path.join(TEST_OUTPUT_PATH, '**'), function() {
      // Create Source Path
      // console.log('beforeEach Step 3');
      mkdirp.sync(TEST_OUTPUT_SRC);

      GLOBAL.config = {
        env: 'dev',
        src: TEST_OUTPUT_SRC,
        dest: TEST_OUTPUT_DEST
      };

      done();
    });
  });

  // Clean up after final test
  after(done => {
    if (watcherTask) {
      watcherTask.close();
      watcherTask = null;
    }

    // Use rimraf over del because it seems to work more reliably on Windows.
    // Probably due to it's retries.
    rimraf(path.join(TEST_OUTPUT_PATH, '**'), done);
  });

  taskHelper.getTasks().map(taskObject => {
    let taskName = taskObject.taskName;
    let task = taskObject.task;

    // Check that there is a watch task
    if (typeof task.watch === 'undefined') {
      return;
    }

    registerTestsForTask(taskName, task);
  });
});
