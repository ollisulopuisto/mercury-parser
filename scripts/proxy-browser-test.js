const express = require('express');
const request = require('request');

const app = express();
let server;

const start = () => {
  app.use('/:url', (req, res) => {
    const url = req.originalUrl.slice(1);
    let safeUrl;

    try {
      const parsedUrl = new URL(url);
      const isAllowedHost =
        parsedUrl.hostname === 'www.cnn.com' || parsedUrl.hostname === 'cnn.com';
      const isAllowedProtocol =
        parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';

      if (!isAllowedHost || !isAllowedProtocol) {
        return res.status(400).send('Bad Request');
      }

      safeUrl = parsedUrl.toString();
    } catch (e) {
      return res.status(400).send('Bad Request');
    }

    const options = {
      url: safeUrl,
      // Don't set encoding; fixes issues
      // w/gzipped responses
      encoding: null,
      // Accept cookies
      jar: true,
      // Accept and decode gzip
      gzip: true,
      // Do not follow redirects to avoid SSRF via redirect targets
      followAllRedirects: false,
    };
    return req.pipe(request(options)).pipe(res);
  });
  server = app.listen(process.env.PORT || 3000);
};

const stop = () => {
  if (server) {
    server.close();
  }
};

start();
require('child_process').exec(
  `node ./node_modules/karma/bin/karma start ./scripts/karma.conf.js${
    process.env.CI ? ' --CI' : ''
  }`,
  { stdio: [0, 1, 2] },
  (err, stdout) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('stdout', stdout);
      process.exit(1);
    } else {
      // eslint-disable-next-line no-console
      console.log('stdout', stdout);
    }
    stop();
  }
);
