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
const taskHelper = require('./helpers/task-helper');

const VALID_TEST_FILES = 'test/data/valid-files';
const TEST_OUTPUT_PATH = 'test/output';

const SUPPORTED_METHODS = ['build', 'watch'];
const REQUIRED_METHODS = ['build'];

let describeTestsForTask = function(taskName, task) {
  describe(taskName, () => {
    it('should only have supported methods', () => {
      let invalidKeys = Object.keys(task).filter(key => {
        if (SUPPORTED_METHODS.indexOf(key) === -1) {
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
      let taskKeys = Object.keys(task);
      let missingMethods = REQUIRED_METHODS.filter(key => {
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

    it('should build cleanly', function(done) {
      // This has to be increased to a minute to ensure Appveyor
      // (i.e. Windows) has time to complete babel build
      this.timeout(60000);
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
};

describe('Run checks and tests against each WSK task', () => {
  const del = require('del');

  // Clean up before each test
  beforeEach(done => del(TEST_OUTPUT_PATH + '/**').then(() => done(), done));

  // Clean up after final test
  after(done => del(TEST_OUTPUT_PATH + '/**').then(() => done(), done));

  taskHelper.getTasks().map(taskObject => {
    let taskName = taskObject.taskName;
    let task = require(taskObject.taskPath);

    describeTestsForTask(taskName, task);
  });
});
