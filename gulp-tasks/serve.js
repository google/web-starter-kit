const browserSync = require('browser-sync');

const server = browserSync.create(global.__buildConfig.serverName);

const serve = () => {
  server.init({
    server: {
      baseDir: global.__buildConfig.dest,
    },
    // Stop the browser from automatically opening
    // open: false,
    notify: false
  });
}

module.exports = {
  task: serve,
};
