const gulp = require('gulp');
const fse = require('fs-extra');

const getTaskFilepaths = require('./utils/get-task-filepaths');

function cleanDestDir() {
  return fse.remove(global.__buildConfig.dest);
}

function build(done) {
  const parallelTasks = [];
  const postBuildTasks = [];
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {build} = require(taskFilepath);
    if (build) {
      if (build.name !== 'serviceWorker') {
        parallelTasks.push(build);
      } else {
        postBuildTasks.push(build);
      }
    }
  }

  const buildTasks = [
    cleanDestDir,
    gulp.parallel(parallelTasks),
    // TODO This causes infinte loop
    // gulp.parallel(postBuildTasks),
  ];

  return gulp.series(buildTasks)(done);
}

module.exports = {
  task: build,
};
