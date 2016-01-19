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

var sass = require('../src/wsk-tasks/sass.js');

describe('This should enforce any rules we want to exist for our tasks', () => {
  // Must clean up the output path
  let fs = require('fs');
  let rimraf = require('rimraf');

  const VALID_TEST_FILES = 'test/data/valid-files';
  const TEST_OUTPUT_PATH = 'test/output';

  let tasksToTest = [
    {taskName: 'sass', task: sass}
  ];

  // Clean up before each test
  beforeEach(done => rimraf(TEST_OUTPUT_PATH, done));

  // Clean up after final test
  after(done => rimraf(TEST_OUTPUT_PATH, done));

  tasksToTest.map(taskObject => {
    let taskName = taskObject.taskName;
    let task = taskObject.task;

    it('should only have supported methods', () => {
      let supportedMethods = ['build', 'watch'];
      let invalidKeys = Object.keys(task).filter(key => {
        if (supportedMethods.indexOf(key) === -1) {
          return key;
        }
      });

      if (invalidKeys.length > 0) {
        let keysString = invalidKeys.join(',');
        throw new Error(`There are unexpected methods ` +
          `in the "${taskName}" task: [ ${keysString} ]`);
      }
    });

    it('should have all required methods', () => {
      let requiredMethods = ['build'];
      let taskKeys = Object.keys(task);
      let missingMethods = requiredMethods.filter(key => {
        if (taskKeys.indexOf(key) === -1) {
          return key;
        }
      });

      if (missingMethods.length > 0) {
        let keysString = missingMethods.join(',');
        throw new Error(`There are missing required methods ` +
          `in the "${taskName}" task: [ ${keysString} ]`);
      }
    });

    it('should build cleanly', done => {
      GLOBAL.config = {
        env: 'prod',
        src: VALID_TEST_FILES,
        dest: TEST_OUTPUT_PATH
      };

      task.build().on('end', () => {
        // Check output exists
        var outputFiles = fs.readdirSync('test/output');
        outputFiles.should.have.length.above(0);

        done();
      });
    });
  });
});
