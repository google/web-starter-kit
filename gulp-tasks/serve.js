const browserSync = require('browser-sync');
const path = require('path');

const server = browserSync.create();

const serve = () => {
  server.watch(path.posix.join(global.__buildConfig.dest, '**', '*'))
    .on('change', server.reload);

  server.init({
    server: {
      baseDir: global.__buildConfig.dest,
    },
    // Stop the browser from automatically opening
    // open: false,
    notify: false,
    // Stop browser sync from logging file events
    logFileChanges: false
  });
}

module.exports = {
  task: serve,
};
