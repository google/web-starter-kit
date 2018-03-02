const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpSass = require('gulp-sass');

const postcssConfig = require('./utils/postcssConfig');

const extensions = [
  'sass',
  'scss',
];

function sass() {
  return gulp.src(`${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`)
  .pipe(sourcemaps.init())
  .pipe(
    gulpSass({
      precision: 10,
    })
    .on('error', gulpSass.logError)
  )
  .pipe(postcssConfig())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(global.__buildConfig.dest));
}

module.exports = {
  build: sass,
  watchGlobs: `${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`,
};
