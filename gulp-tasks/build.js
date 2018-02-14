const gulp = require('gulp');
const fse = require('fs-extra');

const getTaskFilepaths = require('./utils/get-task-filepaths');

const cleanDestDir = () =>  {
  return fse.remove(global.__buildConfig.dest);
};

const build = (done) => {
  const parallelTasks = [];
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {build} = require(taskFilepath);
    if (build) {
      parallelTasks.push(build);
    }
  }

  const buildTasks = [
    cleanDestDir,
    gulp.parallel(parallelTasks),
  ];

  // If there is a serviceWorker task, run it.
  if (gulp.registry().tasks().serviceWorker) {
    buildTasks.push('serviceWorker');
  }

  return gulp.series(buildTasks)(done);
};

module.exports = {
  task: build,
};
