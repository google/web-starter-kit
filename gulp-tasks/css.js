const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

const css = () => {
  return gulp.src(`${global.__buildConfig.src}/**/*.css`)
  .pipe(sourcemaps.init())
  .pipe(postcss([
      cssimport(),
      cssnext({
        features: {
          customProperties: {
            // Allows both fallback and CSS variables to be used
            preserve: true,
          }
        }
      }),
      cssnano({
        // Autoprefixer is provided by cssnext
        autoprefixer: false
      }),
    ])
  )
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.__buildConfig.dest));
};

gulp.task(css);
