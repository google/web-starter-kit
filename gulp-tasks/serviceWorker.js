const path = require('path');
const workboxBuild = require('workbox-build');

async function serviceWorker() {
  await workboxBuild.injectManifest({
    swSrc: path.join(global.__buildConfig.src, 'service-worker.js'),
    swDest: path.join(global.__buildConfig.dest, 'service-worker.js'),
    globDirectory: global.__buildConfig.dest,
  });
}

module.exports = {
  build: serviceWorker,
  watchGlobs: `${global.__buildConfig.dest}/**/*.*`,
};
