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
  console.log('deleteFiles: ', path);
  return new Promise((resolve, reject) => {
    try {
      rimraf(path, err => {
        if (err) {
          console.log('rimraf error :(', err);
          reject(err);
          return;
        }

        console.log('rimraf ok :)');
        resolve();
      });
    } catch (error) {
      console.log('rimraf error :(', error);
      reject(error);
    }
  });
};

const copyFiles = (from, to) => {
  console.log('copyFiles: ', from, to);
  return new Promise((resolve, reject) => {
    try {
      ncp(from, to, err => {
        if (err) {
          console.log('ncp error :(', err);
          reject(err);
          return;
        }

        console.log('ncp OK :)');
        resolve();
      });
    } catch (error) {
      console.log('ncp error :(', error);
    }
  });
};

const validateOutput = () => {
  console.log('validateOutput');
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
  console.log('');
  console.log('');
  console.log('');
  console.log('------------------- START OF TEST');
  // Start Watching
  watcherTask = task.watch();
  if (!watcherTask) {
    return Promise.reject(new Error(`Nothing returned from the tasks watch() method. Is the result of gulp.watch returned in ${taskName}`));
  }

  return new Promise(watcherReadyResolve => {
    console.log('Wait until watcher is ready');
    watcherTask.on('ready', () => {
      watcherReadyResolve();
    });
  })
  .then(() => {
    console.log('Wait until steps have completed');
    return steps.reduce((promise, step) => {
      return promise
        .then(() => {
          return step();
        })
        .then(() => {
          console.log('Step done, waiting');
          // Add time between each step
          return new Promise(timeoutResolve => setTimeout(timeoutResolve, 500));
        })
        .then(() => {
          console.log('Step done and timeout finished');
        })
        .catch(err => {
          console.log('Steps Reduced Promise Error', err);
          throw err;
        });
    }, Promise.resolve());
  })
  .then(() => {
    console.log('Wait until there is a quiet period from the watcher');
    let currentTimeout = null;
    return new Promise((watcherTaskQuietResolve, watcherTaskFinishReject) => {
      // Start the initial timeout
      currentTimeout = setTimeout(watcherTaskQuietResolve, 2000);

      watcherTask.on('all', event => {
        try {
          console.log('Watch Event: ', event);
          if (currentTimeout) {
            clearTimeout(currentTimeout);
          }

          console.log('Watch Event: Step 1', event);

          currentTimeout = setTimeout(watcherTaskQuietResolve, 2000);
          console.log('Watch Event: Step 2', event);
        } catch (error) {
          console.error('Problem waiting for watch task to complete', error);
          watcherTaskFinishReject(error);
        }
      });
    })
    .then(() => {
      console.log('Quiet perioed reached');
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      if (watcherTask) {
        watcherTask.close();
        watcherTask = null;
      }
      console.log('End of then()');
    })
    .catch(error => {
      console.log('Catch()');
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      if (watcherTask) {
        watcherTask.close();
        watcherTask = null;
      }

      throw error;
    });
  })
  .then(() => {
    console.log('Validate the output');
    validateOutput();
    console.log('Output validated');
  })
  .catch(err => {
    console.log('runSteps Error', err);
    throw err;
  });
};

const registerTestsForTask = (taskName, task) => {
  describe(`${taskName}`, function() {
    it('should watch for new files being added to empty directory', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC);
        }
      ];

      runSteps(taskName, task, steps)
      .then(() => {
        console.log('run steps finished');
        done();
      })
      .catch(err => {
        console.log('run steps error', err);
        done(err);
      });
    });

    it('should watch for new files being added and changed', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC)
          .catch(err => {
            console.log('STEP 1 Error', err);
            throw err;
          });
        },
        () => {
          return copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC)
          .catch(err => {
            console.log('STEP 2 Error', err);
            throw err;
          });
        }
      ];

      runSteps(taskName, task, steps)
      .then(() => {
        console.log('run steps finished');
        done();
      })
      .catch(err => {
        console.log('run steps error', err);
        done(err);
      });
    });

    it('should watch for new files being added and deleted', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC);
        },
        () => {
          return deleteFiles(path.join(TEST_OUTPUT_SRC, '*'));
        }
      ];

      runSteps(taskName, task, steps)
      .then(() => {
        console.log('run steps finished');
        done();
      })
      .catch(err => {
        console.log('run steps error', err);
        done(err);
      });
    });

    it('should watch for new files being added, followed by bad example files followed by the original files', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC);
        },
        () => {
          return copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC);
        },
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC);
        }
      ];

      runSteps(taskName, task, steps)
      .then(() => {
        console.log('run steps finished');
        done();
      })
      .catch(err => {
        console.log('run steps error', err);
        done(err);
      });
    });

    it('should watch for new files being added, followed by bad example files followed by the differnt valid files', function(done) {
      // This is a long time to account for slow babel builds on Windows
      this.timeout(60000);

      const steps = [
        () => {
          return copyFiles(VALID_TEST_FILES, TEST_OUTPUT_SRC);
        },
        () => {
          return copyFiles(INVALID_TEST_FILES, TEST_OUTPUT_SRC);
        },
        () => {
          return copyFiles(VALID_TEST_FILES_2, TEST_OUTPUT_SRC);
        }
      ];

      runSteps(taskName, task, steps)
      .then(() => {
        console.log('run steps finished');
        done();
      })
      .catch(err => {
        console.log('run steps error', err);
        done(err);
      });
    });
  });
};

describe('Run tests against watch methods', function() {
  // Clean up before each test
  beforeEach(() => {
    console.log('beforeEach Step 1');
    if (watcherTask) {
      console.log('Watcher task .close()');
      watcherTask.close();
      watcherTask = null;
    }
    console.log('beforeEach Step 2');

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
    })
    .then(() => {
      console.log('');
      console.log('');
      console.log('');
      console.log('END OF BEFORE EACH -----------------*********************');
      console.log('');
      console.log('');
      console.log('');
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
    let task = taskObject.task;

    // Check that there is a watch task
    if (typeof task.watch === 'undefined') {
      return;
    }

    registerTestsForTask(taskName, task);
  });
});
