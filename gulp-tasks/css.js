const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

const postcssConfig = require('./utils/postcssConfig');

function css() {
  return gulp.src(`${global.__buildConfig.src}/**/*.css`)
  .pipe(sourcemaps.init())
  .pipe(postcssConfig())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.__buildConfig.dest));
};

module.exports = {
  build: css,
  watchGlobs: `${global.__buildConfig.src}/**/*.css`,
};
