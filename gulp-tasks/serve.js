const browserSync = require('browser-sync');
const serveStatic = require('serve-static');
const http = require('http');
const path = require('path');

const PREFERRED_PORT = 5000;

const serveViaStatic = () => {
  const serve = serveStatic(global.__buildConfig.dest);

  const httpServer = http.createServer((req, res) => {
    serve(req, res, () => {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found.');
    });
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && err.port === PREFERRED_PORT) {
      console.log(`Oops. Looks like port ${PREFERRED_PORT} is in use, so ` +
        `we'll attempt to run the server on a random port.`);
      httpServer.listen(0, 'localhost');
      return;
    }

    throw err;
  });

  httpServer.listen(PREFERRED_PORT, 'localhost', () => {
    const address = httpServer.address();
    console.log(`Serving @ http://${address.address}:${address.port}`, );
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
    port: PREFERRED_PORT,
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
