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
const glob = require('glob');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const taskHelper = require('../src/wsk-tasks/task-helper');

const VALID_TEST_FILES = path.join('test', 'data', 'valid-files');
const INVALID_TEST_FILES = path.join('test', 'data', 'invalid-files');
const VALID_TEST_FILES_2 = path.join('test', 'data', 'valid-files-2');
const TEST_OUTPUT_PATH = path.join('test', 'output');
const TEST_OUTPUT_SRC = path.join(TEST_OUTPUT_PATH, 'src');
const TEST_OUTPUT_DEST = path.join(TEST_OUTPUT_PATH, 'build');

let watcherTask;
let onStreamCompleteCb;

// Use rimraf over del because it seems to work more reliably on Windows.
// Probably due to it's retries.
const deleteFiles = path => new Promise((resolve, reject) => {
  rimraf(path, err => {
    if (err) {
      reject(err);
      return;
    }

    resolve();
  });
});

const copyFile = (from, to) => new Promise((resolve, reject) => {
  mkdirp.sync(path.dirname(to));

  const readStream = fs.createReadStream(from);
  readStream.on('error', function(err) {
    reject(err);
  });
  const writeStream = fs.createWriteStream(to);
  writeStream.on('error', err => {
    reject(err);
  });
  writeStream.on('close', () => {
    resolve();
  });
  readStream.pipe(writeStream);
});

const validateOutput = testDataDir => {
  // Get directories in build directory
  const folders = fs.readdirSync(TEST_OUTPUT_DEST);
  folders.forEach(folderName => {
    // Check if the source directory lives, if it doesn't we can ignore
    // the remaining output (i.e. old stuff that needs cleaning out)
    try {
      fs.lstatSync(path.join(TEST_OUTPUT_SRC, folderName));
    } catch (err) {
      // Path doesn't exist, we can ignore it
      return;
    }

    const expectedOutputFileBuffer = fs.readFileSync(path.join(testDataDir, folderName, 'output.json'));
    const expectedOutput = JSON.parse(expectedOutputFileBuffer.toString());

    expectedOutput.forEach(file => {
      const fullpath = path.join(TEST_OUTPUT_DEST, folderName, file);
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

/**
 * This method will execute the step function and wait for the watcher to
 * not fire an event for a set period. After this period, it is assumed the
 * watcher has finished building the file changes performed in the step method
 * @param  {Function} step    Steps that manipulate the files being watched
 * @param  {FSWatcher} watcher This is the watcher for the watch() method of the task
 * @return {Promise}         Promise that resolves once the watcher has finished firing events from the changes in the step function
 */
const performStep = (step, watcher) => {
  return new Promise((resolve, reject) => {
    let taskAcknowledged = false;
    onStreamCompleteCb = () => {
      taskAcknowledged = true;
      resolve();
    };

    const watcherCallback = () => {
      taskAcknowledged = true;
      watcher.removeListener('all', watcherCallback);
    };
    watcher.on('all', watcherCallback);

    step()
    .then(() => {
      // Give the watcher one attempt to re-catch a change
      setTimeout(() => {
        if (taskAcknowledged) {
          return;
        }

        step()
        .catch(reject);
      }, 400);
    })
    .catch(reject);
  });
};

/**
 * This method will take all the steps the test wants to perform
 * - in this case copy or delete files into a directory being watched
 * and returns a promise that resolves once all the steps have been performed.
 * @param  {Array<Functions>} steps    Steps that manipulate the files being watched
 * @param  {FSWatcher} watcher This is the watcher for the watch() method of the task
 * @return {Promise}         Resolves once all steps have completed
 */
const stepOverEachStep = (steps, watcher) => {
  return steps.reduce((chainedPromise, nextStep) => {
    return chainedPromise.then(() => performStep(nextStep, watcher));
  }, Promise.resolve());
};

const waitForWatcher = watcher => {
  return new Promise(resolve => {
    watcher.on('ready', () => {
      resolve();
    });
  });
};

/**
 * This function is a helper method that will call the watch method on the
 * task, wait until it's ready to perform actions, and then Run
 * each step that will result in the task building. When finished
 * it will stop the watch task and check if the final output is
 * what we'd expect.
 * @param  {String} taskName name of the tasks file
 * @param  {Object} task     The required task with a watch method
 * @param  {Array<Functions>} steps    Steps that manipulate the files being watched
 * @param  {String} testDataDir Directory of the source files to test for output
 * @return {Promise}          Resolves or Rejects if the tests pass or fail
 */
const performTest = (taskName, task, steps, testDataDir) => {
  GLOBAL.config.reload = function() {
    if (onStreamCompleteCb) {
      onStreamCompleteCb();
    }
  };
  // Start the tasks watching
  watcherTask = task.watch();
  if (!watcherTask) {
    return Promise.reject(new Error(`Nothing returned from the tasks watch() method. Is the result of gulp.watch returned in ${taskName}?`));
  }

  return waitForWatcher(watcherTask)
  .then(() => stepOverEachStep(steps, watcherTask))
  .then(() => {
    return validateOutput(testDataDir);
  });
};

const registerTestsForTask = (taskName, task) => {
  describe(`${taskName}`, function() {
    // Clean up before each test
    beforeEach(function() {
      onStreamCompleteCb = null;

      if (watcherTask) {
        watcherTask.close();
        watcherTask = null;
      }

      return new Promise(resolve => {
        // This is included just to give a small amount of time to
        // ensure the watcher task is closed
        // 1 second is a long time, but given variablility in CI's
        // it's worth including
        setTimeout(resolve, 1000);
      })
      .then(() => {
        return deleteFiles(path.join(TEST_OUTPUT_PATH));
      })
      .then(() => {
        // Create Source Path
        mkdirp.sync(TEST_OUTPUT_SRC);

        GLOBAL.config = {
          env: 'dev',
          src: TEST_OUTPUT_SRC,
          dest: TEST_OUTPUT_DEST
        };
      });
    });

    // Clean up after final test
    after(function() {
      onStreamCompleteCb = null;

      if (watcherTask) {
        watcherTask.close();
        watcherTask = null;
      }

      // return deleteFiles(path.join(TEST_OUTPUT_PATH));
    });

    const TEST_TIMEOUT = 10000;
    const fileExtensions = {
      'html.js': 'html',
      'babel.js': 'js',
      'sass.js': 'scss'
    };
    const fileExtension = fileExtensions[taskName];

    it('should have a file extension to glob for', function() {
      if (!fileExtension) {
        throw new Error(`${taskName} has no files to test but has a watch task`);
      }
    });

    if (!fileExtension) {
      return;
    }

    it('should watch for new files being added to empty directory', function() {
      this.timeout(TEST_TIMEOUT);

      const individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      return performTest(taskName, task, steps, VALID_TEST_FILES);
    });

    it('should watch for new files being added and changed', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(TEST_TIMEOUT);

      let individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps1 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      individualFiles = glob.sync(path.join(VALID_TEST_FILES_2, '**', '*.' + fileExtension));
      const steps2 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES_2.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      const steps = steps1.concat(steps2);

      return performTest(taskName, task, steps, VALID_TEST_FILES_2);
    });

    // NOTE: This test is kind of meh. If we delete a tonne of files, that's
    // fine, but it doesn't actually delete the final output, so the validation
    // passes when it' probably shouldn't
    it('should watch for new files being added and deleted', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(TEST_TIMEOUT);

      let individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps1 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      individualFiles = glob.sync(path.join(TEST_OUTPUT_SRC, '**', '*.' + fileExtension));
      const steps2 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(TEST_OUTPUT_SRC.length);
        return () => deleteFiles(path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      const steps = steps1.concat(steps2);

      return performTest(taskName, task, steps, VALID_TEST_FILES);
    });

    it('should watch for new files being added, followed by bad example files followed by the original files', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(TEST_TIMEOUT);

      let individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps1 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      individualFiles = glob.sync(path.join(INVALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps2 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(INVALID_TEST_FILES.length);
        return () => {
          return copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
        };
      });

      individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps3 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      const steps = steps1.concat(steps2).concat(steps3);

      return performTest(taskName, task, steps, VALID_TEST_FILES);
    });

    it('should watch for new files being added, followed by bad example files followed by the differnt valid files', function() {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(TEST_TIMEOUT);

      let individualFiles = glob.sync(path.join(VALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps1 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      individualFiles = glob.sync(path.join(INVALID_TEST_FILES, '**', '*.' + fileExtension));
      const steps2 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(INVALID_TEST_FILES.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      individualFiles = glob.sync(path.join(VALID_TEST_FILES_2, '**', '*.' + fileExtension));
      const steps3 = individualFiles.map(filePath => {
        const relativeFilePath = filePath.substring(VALID_TEST_FILES_2.length);
        return () => copyFile(filePath, path.join(TEST_OUTPUT_SRC, relativeFilePath));
      });

      const steps = steps1.concat(steps2).concat(steps3);

      return performTest(taskName, task, steps, VALID_TEST_FILES_2);
    });
  });
};

describe('Run tests against watch methods', function() {
  if (process.platform.indexOf('win') === 0) {
    console.warn('Skipping watch task tests. Windows file permissions ' +
    'result in flakey test behaviour.');
    return;
  }

  taskHelper.getTasks().forEach(taskObject => {
    let taskName = taskObject.filename;
    if (taskName === 'browsersync.js') {
      return;
    }

    let task = require(taskObject.path);

    // Check that there is a watch task
    if (typeof task.watch === 'undefined') {
      return;
    }

    registerTestsForTask(taskName, task);
  });
});
