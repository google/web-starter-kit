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

const TASKS_DIRECTORY = path.join(__dirname, '..', 'src', 'wsk-tasks');
const VALID_TEST_FILES = 'test/data/valid-files';
const VALID_CHANGE_TEST_FILES = 'test/data/valid-change-files';
const TEST_OUTPUT_PATH = 'test/output';

function copyFiles(from, to) {
  return new Promise((resolve, reject) => {
    
  });
}

describe('This should test the watch lifecycle for each task', () => {
  let tasksToTest = [];
  let taskFilenames = fs.readdirSync(TASKS_DIRECTORY);
  taskFilenames.map(taskFilename => {
    tasksToTest.push({
      taskName: taskFilename,
      task: require(path.join(TASKS_DIRECTORY, taskFilename))
    });
  });

  // Clean up before each test
  beforeEach(done => del(TEST_OUTPUT_PATH + '/**').then(() => done(), done));

  // Clean up after final test
  after(done => del(TEST_OUTPUT_PATH + '/**').then(() => done(), done));

  tasksToTest.map(taskObject => {
    let taskName = taskObject.taskName;
    let task = taskObject.task;

    // Check that there is a watch task
    if (typeof task.watch === 'undefined') {
      return;
    }

    describe(`Test the watch task of ${taskName}`, () => {
      it('should watch for new file changes', function(done) {
        // This is a long time to account for slow babel builds on Windows
        this.timeout(60000);

        const testSrcPath = path.join(TEST_OUTPUT_PATH, 'src');
        mkdirp.sync(testSrcPath);

        ncp(VALID_TEST_FILES, testSrcPath, err => {
          if (err) {
            return done(err);
          }

          GLOBAL.config = {
            env: 'dev',
            src: testSrcPath,
            dest: path.join(TEST_OUTPUT_PATH, 'build')
          };

          // VALID_CHANGE_TEST_FILES
          let changeLogged = false
          task.watch(() => {
            console.log('change logged');
            if (!changeLogged) {
              changeLogged = true;
              done();
            }
          });

          setTimeout(() => {
            const deletePath = path.join(testSrcPath, 'sass', 'nest1', 'nest2', 'nest3', '**');
            console.log('deletePath: ', deletePath);
            del(deletePath)
            .then(() => {
              console.log('Deleted');
              /** ncp(VALID_CHANGE_TEST_FILES, testSrcPath, err => {
                if (err) {
                  return done(err);
                }

                console.log('Files changed');
              });**/
            })
            .catch(err => {
              console.log(err);
            });
          }, 2000);
          /** .on('end', () => {
            // Check output exists
            var outputFiles = fs.readdirSync('test/output');
            outputFiles.should.have.length.above(0);

            done();
          });**/
        });
      });
    });
  });
});
