const gulp = require('gulp');

const getTaskFilepaths = require('./utils/get-task-filepaths');

const watch = (done) => {
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
