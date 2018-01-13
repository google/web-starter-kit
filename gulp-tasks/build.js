const gulp = require('gulp');
const fse = require('fs-extra');

const build = (done) => {
  return gulp.series([
    () => fse.remove(global.__buildConfig.dest),
    gulp.parallel([
      'copy',
      'css',
      'html',
      'images',
      'sass',
      'scripts',
    ]),
    'serviceWorker',
  ])(done);
};

gulp.task(build);
