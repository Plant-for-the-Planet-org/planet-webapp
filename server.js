/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  const WORKERS = process.env.WEB_CONCURRENCY || numCPUs;
  console.log('Number of workers calculated:', WORKERS);
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const nextApp = next({ dir: '.', dev });
  const nextHandler = nextApp.getRequestHandler();

  nextApp.prepare().then(async () => {
    const server = express();

    if (!dev) {
      // Enforce SSL & HSTS in production
      // eslint-disable-next-line no-shadow
      server.use((req, res, next) => {
        const proto = req.headers['x-forwarded-proto'];
        if (proto === 'https') {
          res.set({
            'Strict-Transport-Security': 'max-age=31557600', // one-year
            /* Code below is commented out to allow embedding of the site in an iframe */
            // 'X-Frame-Options': 'DENY',
            // 'Content-Security-Policy': 'frame-ancestors \'none\'',
          });
          return next();
        }
        res.redirect(`https://${req.headers.host}${req.url}`);
      });
    }

    // Static files
    // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
    server.use(
      '/static',
      express.static(path.join(__dirname, 'static'), {
        maxAge: dev ? '0' : '365d',
      })
    );

    // Example server-side routing
    // server.get('/a', (req, res) => {
    //   return nextApp.render(req, res, '/b', req.query)
    // })

    // Default catch-all renders Next app
    server.get('*', (req, res) => {
      // res.set({
      //   'Cache-Control': 'public, max-age=3600'
      // });
      const parsedUrl = url.parse(req.url, true);
      nextHandler(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Listening on http://localhost:${port}`);
    });
  });
}
