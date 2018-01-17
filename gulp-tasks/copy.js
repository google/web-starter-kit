const gulp = require('gulp');

const copy = () => {
  const extensions = [
    'json',
    'ico'
  ];
  return gulp.src(`${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`)
  .pipe(gulp.dest(global.__buildConfig.dest));
}

gulp.task(copy);
