const path = require('path');
const gulp = require('gulp');
const rollup = require('rollup');
const rollupStream = require('rollup-stream');
const replacePlugin = require('rollup-plugin-replace');
const uglifyPlugin = require('rollup-plugin-uglify');
const esMinify = require('uglify-es').minify;
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

const glob = require('./utils/glob-promise');

const processScript = (scriptPath, relativePath) => {
  return rollupStream({
    rollup,
    input: scriptPath,
    output: {
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      replacePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      uglifyPlugin({}, esMinify),
    ],
  })
  .pipe(source(relativePath))
  // buffer the output. most gulp plugins, including gulp-sourcemaps,
  // don't support streams.
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.__buildConfig.dest));
};

const javascript = (done) => {
  // If you want to restrict which javascript files are built with rollup you
  // can alter this regex to match specific file(s) or directories of files.
  return glob('**/*.js', {
    cwd: global.__buildConfig.src,
    absolute: true,
  })
  .then((scriptFiles) => {
    if (scriptFiles.length === 0) {
      done();
      return;
    }

    const scriptFunctions = scriptFiles.map((filePath) => {
      const relativePath = path.relative(
        path.normalize(global.__buildConfig.src),
        filePath
      );

      const cb = () => processScript(filePath, relativePath);
      cb.displayName = `scripts: ${relativePath}`;
      return cb;
    });

    // This seems to be the only way to use gulp.parallel to wait for the
    // streams to finish.
    return gulp.parallel(scriptFunctions)(done);
  });
};

module.exports = {
  build: javascript,
  watchGlobs: `${global.__buildConfig.src}/**/*.js`,
};
