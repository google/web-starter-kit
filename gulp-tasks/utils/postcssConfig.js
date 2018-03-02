const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');

module.exports = function() {
  return postcss([
    cssimport(),
    cssnext({
      features: {
        customProperties: {
          // Allows both fallback and CSS variables to be used
          preserve: true,
        },
      },
    }),
    cssnano({
      autoprefixer: false,
    }),
  ]);
};
