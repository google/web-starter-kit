const path = require('path');
const gulp = require('gulp');
const workboxBuild = require('workbox-build');

const serviceWorker = async () => {
  await workboxBuild.injectManifest({
    swSrc: path.join(global.__buildConfig.src, 'service-worker.js'),
    swDest: path.join(global.__buildConfig.dest, 'service-worker.js'),
    globDirectory: global.__buildConfig.dest
  });
};

module.exports = {
  task: serviceWorker,
  watchGlobs: `${global.__buildConfig.dest}/**/*.*`
};
