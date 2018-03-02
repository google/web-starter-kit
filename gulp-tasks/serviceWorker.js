const path = require('path');
const workboxBuild = require('workbox-build');

const SW_FILENAME = 'service-worker.js';

async function serviceWorker() {
  await workboxBuild.injectManifest({
    swSrc: path.join(global.__buildConfig.src, SW_FILENAME),
    swDest: path.join(global.__buildConfig.dest, SW_FILENAME),
    globDirectory: global.__buildConfig.dest,
  });
}

module.exports = {
  build: serviceWorker,
  watchGlobs: [
    `${global.__buildConfig.dest}/**/*.*`,
    `!${global.__buildConfig.dest}/${SW_FILENAME}`
  ],
};
