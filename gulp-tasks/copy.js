const gulp = require('gulp');

const extensions = [
  'json',
  'ico'
];

const copy = () => {
  return gulp.src(`${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`)
  .pipe(gulp.dest(global.__buildConfig.dest));
}

module.exports = {
  task: copy,
  build: copy,
  watchGlobs: `${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`
};
