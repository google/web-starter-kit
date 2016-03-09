/*
  Copyright 2016 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

'use strict';

/* eslint-disable max-len, no-console, padded-blocks, no-multiple-empty-lines */
/* eslint-env node,mocha */

// These tests make use of selenium-webdriver. You can find the relevant
// documentation here: http://selenium.googlecode.com/git/docs/api/javascript/index.html

require('chai').should();
const path = require('path');
const del = require('del');
const swTestingHelpers = require('sw-testing-helpers');
const MochaUtils = require('../node_modules/sw-testing-helpers/src/mocha/utils.js');
const testServer = new swTestingHelpers.TestServer();
const automatedBrowserTesting = swTestingHelpers.automatedBrowserTesting;

describe('Test WSK in Browser', function() {
  if (process.env.APPVEYOR) {
    console.warn('Skipping automated browser tests on AppVeyor.');
    return;
  }

  if (process.env.TRAVIS && process.platform === 'darwin') {
    console.warn('Skipping automated browser tests on Travis OS X.');
    return;
  }

  // Browser tests can be slow
  this.timeout(60000);

  // Before the tests start, we must build the current files
  GLOBAL.config = {
    env: 'prod',
    src: 'test/data/valid-files',
    dest: 'test/output'
  };

  // Driver is initialised to null to handle scenarios
  // where the desired browser isn't installed / fails to load
  // Null allows afterEach a safe way to skip quiting the driver
  let globalDriverReference = null;
  let testServerURL;

  before(function() {
    return testServer.startServer(path.join(__dirname, '..'))
    .then(portNumber => {
      testServerURL = `http://localhost:${portNumber}`;
    });
  });

  after(function() {
    testServer.killServer();
  });

  afterEach(function() {
    this.timeout(10000);

    return automatedBrowserTesting.killWebDriver(globalDriverReference);
  });

  const queueUnitTest = browserInfo => {
    it(`should pass all tests in ${browserInfo.prettyName}`, () => {

      globalDriverReference = browserInfo.getSeleniumDriver();

      return automatedBrowserTesting.runMochaTests(
        browserInfo.prettyName,
        globalDriverReference,
        `${testServerURL}/test/browser-tests/`
      )
      .then(testResults => {
        if (testResults.failed.length > 0) {
          throw new Error(MochaUtils.prettyPrintErrors(
            browserInfo.prettyName,
            testResults
          ));
        }
      });
    });
  };

  function buildTestData(environment) {
    GLOBAL.config.env = environment;

    const taskHelper = require('../src/wsk-tasks/task-helper');
    const promises = taskHelper.getTasks().map(taskObject => {
      var task = require(taskObject.path);
      if (task.build) {
        return new Promise(resolve => {
          const result = task.build();
          if (result instanceof Promise) {
            result.then(() => resolve());
          } else {
            result.on('end', resolve);
          }
        });
      }

      return Promise.resolve();
    });
    return Promise.all(promises);
  }

  function clearTestDataBuild() {
    return del(GLOBAL.config.dest + '/**');
  }

  function registerTests() {
    const automatedBrowsers = automatedBrowserTesting.getAutomatedBrowsers();
    automatedBrowsers.forEach(browserInfo => {
      if (browserInfo.releaseName === 'unstable') {
        return;
      }

      queueUnitTest(browserInfo);
    });
  }

  describe('Test Dev Environment', function() {
    before(function() {
      this.timeout(60000);
      return clearTestDataBuild()
      .then(() => buildTestData('dev'));
    });

    after(clearTestDataBuild);

    registerTests();
  });

  describe('Test Prod Environment', function() {
    before(function() {
      this.timeout(10000);
      return clearTestDataBuild()
      .then(() => buildTestData('prod'));
    });
    after(clearTestDataBuild);

    registerTests();
  });
});
