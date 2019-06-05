/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
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

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import workboxBuild from 'workbox-build';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import manifest from './app/manifest';

const $ = gulpLoadPlugins(),
  reload = browserSync.reload,
  src = `${__dirname}/app`,
  dist = `${__dirname}/dist`;

// Lint JavaScript
let lintTask = () =>
  gulp.src(['app/scripts/**/*.js', '!node_modules/**']).
    pipe($.eslint()).
    pipe($.eslint.format()).
    pipe($.if(!browserSync.active, $.eslint.failAfterError()));
gulp.task('lint', lintTask);

// Optimize images
let imagesTask = () =>
  gulp.src('app/images/**/*').pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true,
  }))).pipe(gulp.dest('dist/images')).pipe($.size({title: 'images'}));
gulp.task('images', imagesTask);

// Copy all files at the root level (app)
let copyTask = () =>
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess',
  ], {
    dot: true,
  }).pipe(gulp.dest('dist')).pipe($.size({title: 'copy'}));
gulp.task('copy', copyTask,
);

// Compile and automatically prefix stylesheets
let stylesTask = () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'app/styles/**/*.scss',
      'app/styles/**/*.css',
    ]).
    pipe($.newer('.tmp/styles')).
    pipe($.sourcemaps.init()).
    pipe($.sass({
      precision: 10,
    }).on('error', $.sass.logError)).
    pipe($.autoprefixer(AUTOPREFIXER_BROWSERS)).
    pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano())).
    pipe($.size({title: 'styles'})).
    pipe($.sourcemaps.write('./')).
    pipe(gulp.dest('dist/styles')).
    pipe(gulp.dest('.tmp/styles'));
};
gulp.task('styles', stylesTask);

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
let scriptsTask = gulp.parallel(
  () =>
    gulp.src([
        // Note: Since we are not using useref in the scripts build pipeline,
        //       you need to explicitly list your scripts here in the right order
        //       to be correctly concatenated
        './app/scripts/main.js',
        // Other scripts
      ]).
      pipe($.newer('.tmp/scripts')).
      pipe($.sourcemaps.init()).
      pipe($.babel()).
      pipe($.sourcemaps.write()).
      pipe(gulp.dest('.tmp/scripts')).
      pipe($.concat('main.min.js')).
      pipe($.uglify())
      // Output files
      .pipe($.size({title: 'scripts'})).
      pipe($.sourcemaps.write('.')).
      pipe(gulp.dest('dist/scripts')).
      pipe(gulp.dest('.tmp/scripts')),
  () => gulp.src([
      'app/scripts/sw/*.js',
    ]).
    pipe($.newer('.tmp/scripts')).
    pipe($.sourcemaps.init()).
    pipe($.babel()).
    pipe($.sourcemaps.write()).
    pipe(gulp.dest('.tmp/scripts')).
    pipe($.concat('sw.min.js')).
    pipe($.uglify())
    // Output files
    .pipe($.size({title: 'scripts'})).
    pipe($.sourcemaps.write('.')).
    pipe(gulp.dest('dist/scripts')).
    pipe(gulp.dest('.tmp/scripts')),
);
gulp.task('scripts', scriptsTask);

// Scan your HTML for assets & optimize them
let htmlTask = () => {
  return gulp.src('app/**/*.html').
    pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true,
    }))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
    })))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true}))).
    pipe(gulp.dest('dist'));
};
gulp.task('html', htmlTask);

// Clean output directory
let cleanTask = () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true});
gulp.task('clean', cleanTask);

// Watch files for changes & reload
let serverTask = () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app'],
    port: 3000,
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], gulp.series(stylesTask, reload));
  gulp.watch(['app/scripts/**/*.js'],
    gulp.series(lintTask, scriptsTask, reload));
  gulp.watch(['app/images/**/*'], reload);
};
gulp.task('server', gulp.series(scriptsTask, stylesTask, serverTask));

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
let generateSwTask = () => {
  return workboxBuild.injectManifest({
    globDirectory: dist,
    globPatterns: [
      '**/*.{html,js,css}',
    ],
    swDest: `${dist}/service-worker.js`,
    swSrc: `${src}/service-worker.js`,
  });
};
let workBoxInServiceWorker = () => {
  const rootDir = 'dist';
  const filepath = path.join(rootDir, 'service-worker.js');

  return workboxBuild.generateSW({
    globDirectory: "dist/",
    globPatterns: [
      "**/*.{html,ico,txt,svg,png,json,webapp,js,css,mjs}"
    ],
    swDest: filepath,
    importWorkboxFrom: 'local',
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
      {
        urlPattern: ({event}) => event.request.mode === 'navigate',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: new RegExp(/\.(?:googleapis|gstatic)\.com$/),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: new RegExp(/https:\/\/code\.getmdl\.io$/),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }
      ],
    importScripts: [
      'scripts/sw.min.js',
    ],
    cacheId: manifest.short_name || 'web-starter-kit',
    offlineGoogleAnalytics: true,
    cleanupOutdatedCaches: true,
  }, generateSwTask);
};
gulp.task('service-worker', workBoxInServiceWorker);

// Build production files, the default task
let defaultTask = gulp.series(cleanTask, stylesTask,
  gulp.parallel(htmlTask, imagesTask, lintTask, scriptsTask, copyTask),
  workBoxInServiceWorker);
gulp.task('default', defaultTask);

// Build and serve the output from the dist build
let serverDistTask = gulp.series(defaultTask, () =>
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001,
  }));
gulp.task('server:dist', serverDistTask);

// Run PageSpeed Insights
let pageSpeedTask = cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
gulp.task('pagespeed', pageSpeedTask);

// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
