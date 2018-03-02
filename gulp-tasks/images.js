const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

const extensions = [
  'jpeg',
  'jpg',
  'png',
  'gif',
  'svg',
];

function images() {
  return gulp.src(`${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`)
  .pipe(imagemin())
  .pipe(gulp.dest(global.__buildConfig.dest));
};

module.exports = {
  build: images,
  watchGlobs: `${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`,
};
