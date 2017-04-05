const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const port = process.env.PORT || 3000;
const domain =  process.env.DOMAIN;

function ensureDomain(req, res, next) {
  if (!domain || req.hostname === domain) {
    // OK, continue
    return next();
  };

  // handle port numbers if you need non defaults
  res.redirect(`http://${domain}${req.url}`);
};

const app = express();

// at top of routing calls
app.all('*', ensureDomain);

app.use(compression());

// default to .html (you can omit the extension in the URL)
app.use(serveStatic(`${__dirname}/public`, {'extensions': ['html']}));

app.listen(port, () => {
  console.log('Server running...');
});
