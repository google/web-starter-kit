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

/* eslint-env mocha, browser */
/* global chai */
/* eslint no-eval: 0 */

function performTest(testFile) {
  it('should be able to eval the final output from babel for ' + testFile, function() {
    return fetch(testFile)
    .then(function(response) {
      response.status.should.equal(200);
      return response.text();
    })
    .then(function(response) {
      chai.expect(function() {
        eval(response);
      }).to.not.throw();
    });
  });
}

describe('Test final script output', function() {
  const testFiles = [
    '/test/output/babel/commonjs-module-cubed.js',
    '/test/output/babel/commonjs-module-square.js',
    '/test/output/babel/commonjs-use-test.js',
    '/test/output/babel/es2015-imports.js',
    '/test/output/babel/es2015-module-multiple-exports.js',
    '/test/output/babel/mixed-use.js'
  ];

  testFiles.forEach(testFile => performTest(testFile));
});
