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
const dependencyCaveat = require('../dependency-caveats.json');

const checkDependencies = (packageManifest, additionalOps) => {
  return new Promise((resolve, reject) => {
    const options = Object.assign({stable: true}, additionalOps);
    const david = require('david');
    david.getUpdatedDependencies(packageManifest, options, function(er, deps) {
      if (er) {
        reject(er);
        return;
      }

      const filteredOutdatedDeps = {};
      const outdatedDependencies = Object.keys(deps);

      outdatedDependencies.forEach(dependencyName => {
        if (dependencyCaveat[dependencyName]) {
          const caveatDetails = dependencyCaveat[dependencyName];
          const dependencyDetails = deps[dependencyName];

          if (
            dependencyDetails.required === caveatDetails.overrideVersion ||
            dependencyDetails.stable === caveatDetails.currentVersion
          ) {
            return;
          }
        }

        filteredOutdatedDeps[dependencyName] = deps[dependencyName];
      });

      // Show some useful debugging info
      if (Object.keys(filteredOutdatedDeps).length > 0) {
        const title = options.dev ? 'Dev Dependencies' : 'Dependencies';
        console.error(`---------------- Out of Date ${title} ----------------`);
        Object.keys(filteredOutdatedDeps).map(dependencyName => {
          console.error(`${dependencyName} is out of date.`);
          console.error(`    package.json requires: ${filteredOutdatedDeps[dependencyName].required}`);
          console.error(`    NPM Stable is:         ${filteredOutdatedDeps[dependencyName].stable}`);
        });
        console.error('---------------- ------------------------ ----------------');
      }

      resolve(filteredOutdatedDeps);
    });
  })
  .then(outdatedDependencies => {
    Object.keys(outdatedDependencies).length.should.equal(0);
  });
};

describe('Check that the dependencies of the project are up to date', () => {
  if (process.env.TRAVIS_PULL_REQUEST) {
    console.warn('Skipping dependency checks for pull request');
    return;
  }

  const packageManifest = require(path.join(__dirname, '..', 'package.json'));

  it('should have up to date npm dependencies', function() {
    // AppVeyor is slow to get a response from NPM sometimes
    this.timeout(6000);
    return checkDependencies(packageManifest, {
      dev: false
    });
  });

  it('should have up to date npm devDependencies', function() {
    // AppVeyor is slow to get a response from NPM sometimes
    this.timeout(6000);
    return checkDependencies(packageManifest, {
      dev: true
    });
  });
});
