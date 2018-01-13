const gulp = require('gulp');
const fse = require('fs-extra');

const build = (done) => {
  return gulp.parallel([
    () => fse.remove(global.__buildConfig.dest),
    'copy',
    'css',
    'html',
    'images',
    'sass',
    'scripts',
    'serviceWorker',
  ])(done);
};

gulp.task(build);
