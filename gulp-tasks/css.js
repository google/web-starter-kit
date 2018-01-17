const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

const postcssConfig = require('./utils/postcssConfig');

const css = () => {
  return gulp.src(`${global.__buildConfig.src}/**/*.css`)
  .pipe(sourcemaps.init())
  .pipe(postcssConfig())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.__buildConfig.dest));
};

gulp.task(css);
