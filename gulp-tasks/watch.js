const gulp = require('gulp');
const fse = require('fs-extra');

const getTaskFilepaths = require('./utils/get-task-filepaths');

const watch = (done) => {
  const watchTasks = [];
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {watchGlobs, build} = require(taskFilepath);
    if (watchGlobs && build) {
      gulp.watch(watchGlobs, build);
    }
  }
};

module.exports = {
  task: watch,
};
