'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var del = require('del');

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));
