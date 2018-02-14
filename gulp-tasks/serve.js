const browserSync = require('browser-sync');
const serveStatic = require('serve-static');
const http = require('http');
const path = require('path');

const PORT = 5000;

const serveViaStatic = () => {
  const serve = serveStatic(global.__buildConfig.dest);

  const httpServer = http.createServer((req, res) => {
    serve(req, res, () => {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found.');
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Serving at http://localhost:${PORT}`);
  });
};

const serveViaBrowserSync = () => {
  const server = browserSync.create();

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
    logFileChanges: false,
    // Force port to match dev and prod tasks,
    port: PORT,
  });
};

const serve = () => {
  if (process.env.NODE_ENV === 'production') {
    return serveViaStatic();
  } else {
    return serveViaBrowserSync();
  }
}

module.exports = {
  task: serve,
};
