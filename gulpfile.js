/**
 *
 *  Web Starter Kit
 *  Copyright 2018 Google Inc. All rights reserved.
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

const path = require('path');

global.__buildConfig = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'build'),
};

require('./gulp-tasks/html.js');
require('./gulp-tasks/css.js');
require('./gulp-tasks/copy.js');
require('./gulp-tasks/images.js');
require('./gulp-tasks/sass.js');
require('./gulp-tasks/scripts.js');
require('./gulp-tasks/build.js');
require('./gulp-tasks/serviceWorker.js');
