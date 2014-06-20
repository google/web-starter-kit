/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', jshint);

// Optimize Images
gulp.task('images', images);

// Automatically Prefix CSS
gulp.task('styles:css', stylesCSS);

// Compile Sass For Style Guide Components (app/styles/components)
gulp.task('styles:components', stylesComponents);

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', stylesSCSS);

// Output Final CSS Styles
gulp.task('styles', ['styles:components', 'styles:scss', 'styles:css']);

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', html);

// Clean Output Directory
gulp.task('clean', clean);

// Watch Files For Changes & Reload
gulp.task('serve', serve);

// Build Production Files, the Default Task
gulp.task('default', ['clean'], defaultTask);

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeedTask);

function jshint() {} {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(reload({stream: true, once: true}));
}


function images () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'images'}));
}


function stylesCSS() {
    return gulp.src('app/styles/**/*.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({stream: true}))
        .pipe($.size({title: 'styles:css'}));
}


function stylesComponents() {
    return gulp.src('app/styles/components/components.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/styles/components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles/components'))
        .pipe($.size({title: 'styles:components'}));
}


function stylesSCSS() {
    return gulp.src(['app/styles/**/*.scss', '!app/styles/components/components.scss'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/styles']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles:scss'}));
}


function html() {
    return gulp.src('app/**/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        // Concatenate And Minify JavaScript
        .pipe($.if('*.js', $.uglify()))
        // Concatenate And Minify Styles
        .pipe($.if('*.css', $.csso()))
        // Remove Any Unused CSS
        // Note: If not using the Style Guide, you can delete it from
        // the next line to only include styles your project uses.
        .pipe($.if('*.css', $.uncss({ html: ['app/index.html','app/styleguide/index.html'] })))
        .pipe($.useref.restore())
        .pipe($.useref())
        // Update Production Style Guide Paths
        .pipe($.replace('components/components.css', 'components/main.min.css'))
        // Minify Any HTML
        .pipe($.minifyHtml())
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
}


function clean(cb) {
    rimraf('dist', rimraf.bind({}, '.tmp', cb));
}


function serve() {
    browserSync.init(null, {
        server: {
            baseDir: ['app', '.tmp']
        },
        notify: false
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{css,scss}'], ['styles']);
    gulp.watch(['.tmp/styles/**/*.css'], reload);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], ['images']);
}


function defaultTask(cb) {
    runSequence('styles', ['jshint', 'html', 'images'], cb);
}


function pagespeedTask() {
    pagespeed.bind(null, {
        // By default, we use the PageSpeed Insights
        // free (no API key) tier. You can use a Google
        // Developer API key if you have one. See
        // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
        url: 'https://example.com',
        strategy: 'mobile'
    });
}