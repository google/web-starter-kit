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

let watcherTask;

// Use rimraf over del because it seems to work more reliably on Windows.
// Probably due to it's retries.
const deleteFiles = path => {
  return new Promise((resolve, reject) => {
    rimraf(path, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  })
  .catch(err => {
    console.log('deleteFiles() error ', err);
    throw err;
  });
};

const copyFiles = (from, to) => {
  return new Promise((resolve, reject) => {
    ncp(from, to, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  })
  .catch(err => {
    console.log('copyFiles() error ', err);
    throw err;
  });
};

const validateOutput = () => {
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

    const expectedOutputFileBuffer = fs.readFileSync(path.join(TEST_OUTPUT_SRC, folderName, 'output.json'));
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

const performStep = (step, watcher) => {
  return new Promise(resolve => {
    let lastTimeout = Date.now();
    let callback = () => {
      lastTimeout = Date.now();
    };
    watcher.on('all', callback);

    step();

    let timeoutHandler = () => {
      if ((Date.now() - lastTimeout) > 2000) {
        watcher.removeListener('all', callback);
        resolve();
      } else {
        setTimeout(timeoutHandler, 1000);
      }
    };

    timeoutHandler();
  });
};

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

const performTest = (taskName, task, steps) => {
  // Start the tasks watching
  watcherTask = task.watch();
  if (!watcherTask) {
    return Promise.reject(new Error(`Nothing returned from the tasks watch() method. Is the result of gulp.watch returned in ${taskName}`));
  }

  return waitForWatcher(watcherTask)
  .then(() => stepOverEachStep(steps, watcherTask))
  .then(() => {
    if (watcherTask) {
      watcherTask.close();
      watcherTask = null;
    }
  })
  .then(() => {
    validateOutput();
  });
};

const registerTestsForTask = (taskName, task) => {
  describe(`${taskName}`, function() {
    it('should watch for new files being added to empty directory', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC)
      ];

      performTest(taskName, task, steps)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should watch for new files being added and changed', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC)
      ];

      performTest(taskName, task, steps)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should watch for new files being added and deleted', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => deleteFiles(path.join(TEST_OUTPUT_SRC, '*'))
      ];

      performTest(taskName, task, steps)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should watch for new files being added, followed by bad example files followed by the original files', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC)
      ];

      performTest(taskName, task, steps)
      .then(() => done())
      .catch(err => done(err));
    });

    it('should watch for new files being added, followed by bad example files followed by the differnt valid files', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC),
        () => copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC)
      ];

      performTest(taskName, task, steps)
      .then(() => done())
      .catch(err => done(err));
    });
  });
};

describe('Run tests against watch methods', function() {
  if (process.platform.indexOf('win') === 0) {
    console.warn('Skipping watch task tests. Windows file permissions ' +
    'result in flakey test behaviour.');
    return;
  }

  // Clean up before each test
  beforeEach(() => {
    if (watcherTask) {
      watcherTask.close();
      watcherTask = null;
    }

    return deleteFiles(path.join(TEST_OUTPUT_PATH, '**'))
    .then(() => {
      // Create Source Path
      // console.log('beforeEach Step 3');
      mkdirp.sync(TEST_OUTPUT_SRC);

      GLOBAL.config = {
        env: 'dev',
        src: TEST_OUTPUT_SRC,
        dest: TEST_OUTPUT_DEST
      };
    });
  });

  // Clean up after final test
  after(() => {
    if (watcherTask) {
      watcherTask.close();
      watcherTask = null;
    }

    // Use rimraf over del because it seems to work more reliably on Windows.
    // Probably due to it's retries.
    return deleteFiles(path.join(TEST_OUTPUT_PATH, '**'));
  });

  taskHelper.getTasks().map(taskObject => {
    let taskName = taskObject.taskName;
    let task = require(taskObject.taskPath);

    // Check that there is a watch task
    if (typeof task.watch === 'undefined') {
      return;
    }

    registerTestsForTask(taskName, task);
  });
});
