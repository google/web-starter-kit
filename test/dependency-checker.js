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
const dependencyCaveat = require('../dependency-caveats.json');

describe('Check that the dependencies of the project are up to date', () => {
  if (process.env.TRAVIS_PULL_REQUEST) {
    console.warn('Skipping dependency checks for pull request');
    return;
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

      const outdatedDependencies = Object.keys(deps);
      outdatedDependencies.forEach((dependencyName, index) => {
        if (!dependencyCaveat[dependencyName]) {
          return;
        }

        const caveatDetails = dependencyCaveat[dependencyName];
        const dependencyDetails = deps[dependencyName];

        if (
          dependencyDetails.required === caveatDetails.overrideVersion ||
          deps.gulp.stable === caveatDetails.currentVersion
        ) {
          outdatedDependencies.splice(index, 1);
        } else {
          console.warn(`Dependency caveat for ${dependencyName} is out of date`);
        }
      });

      // Show some useful debugging info
      if (outdatedDependencies.length > 0) {
        console.error('---------------- Out of Date Dependencies ----------------');
        outdatedDependencies.map(dependencyName => {
          const dependencyDetails = deps[dependencyName];
          console.error(`${dependencyName} is out of date.`);
          console.error(`    package.json requires: ${dependencyDetails.required}`);
          console.error(`    NPM Stable is:         ${dependencyDetails.stable}`);
          console.error(`    NPM Latest is:         ${dependencyDetails.latest}`);
        });
        console.error('---------------- ------------------------ ----------------');
      }

      outdatedDependencies.length.should.equal(0);
      done();
    });
  });
});
