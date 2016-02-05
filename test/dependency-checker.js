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

const path = require('path');
const david = require('david');

describe('Check that the dependencies of the project are up to date', () => {
  function listDependencies(deps) {
    Object.keys(deps).forEach(function(depName) {
      var required = deps[depName].required || '*';
      var stable = deps[depName].stable || 'None';
      var latest = deps[depName].latest;
      console.log('%s Required: %s Stable: %s Latest: %s', depName, required, stable, latest);
    });
  }

  it('should have up to date npm dependencies', done => {
    const packageManifest = require(path.join(__dirname, '..', 'package.json'));

    david.getUpdatedDependencies(packageManifest, {stable: true}, function(er, deps) {
      if (er) {
        return done(er);
      }

      Object.keys(deps).length.should.equal(0);
      done();
    });
  });

  it('should have up to date npm dev-dependencies', done => {
    const packageManifest = require(path.join(__dirname, '..', 'package.json'));
    david.getUpdatedDependencies(packageManifest, {dev: true, stable: true}, function(er, deps) {
      if (er) {
        return done(er);
      }

      // We need gulp 4.0 which at the moment isn't stable.
      // Ignore this dependency change gulp is updated
      if (
        deps.gulp &&
        deps.gulp.required === 'gulpjs/gulp#4.0' &&
        deps.gulp.stable === '3.9.0' &&
        deps.gulp.latest === '3.9.0'
      ) {
        delete deps.gulp;
      }

      Object.keys(deps).length.should.equal(0);
      done();
    });
  });
});
