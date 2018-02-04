const gulp = require('gulp');
const fse = require('fs-extra');
const browserSync = require('browser-sync');

const getTaskFilepaths = require('./utils/get-task-filepaths');

const watch = (done) => {
  let server = null;
  if (browserSync.has(global.__buildConfig.serverName)) {
    server = browserSync.get(global.__buildConfig.serverName);
  }

  const watchTasks = [];
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {watchGlobs, build} = require(taskFilepath);
    if (watchGlobs && build) {
      const watcher = gulp.watch(watchGlobs, build);
      if (server) {
        watcher.on('change', server.reload);
      }
    }
  }
};

module.exports = {
  task: watch,
};
