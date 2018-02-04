const gulp = require('gulp');
const fse = require('fs-extra');

const getTaskFilepaths = require('./utils/get-task-filepaths');

const cleanDestDir = () =>  {
  return fse.remove(global.__buildConfig.dest);
};

const build = () => {
  const buildTasks = [];
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {build} = require(taskFilepath);
    if (build) {
      buildTasks.push(build);
    }
  }

  return gulp.series([
    cleanDestDir,
    gulp.parallel(buildTasks),
  ])();
};

module.exports = {
  task: build,
};
