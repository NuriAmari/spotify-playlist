'use strict';

/** Module dependencies. */
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const path         = require('path');
const logger       = require('morgan');
const routes       = require('./routes');
const Playlist = require('./model/playlist');
const Party = require('./model/party');
var cors     = require('cors');

const port = process.env.PORT || 3000;

// configure the express server
const app = express();

app.use(cors());

// if we're developing, use webpack middleware for module hot reloading
if (process.env.NODE_ENV !== 'production') {
  console.log('==> 🌎 using webpack');

  // load and configure webpack
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack/dev.config');

  // setup middleware
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.set('port', port);
app.use(logger('dev'))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(path.resolve(__dirname, '../public')))
  .use('/', routes);

  app.post('/playlist', function(req, res,next) {
    var playlist = new Playlist();
    console.log('playlist--------------------',playlist);		// create a new instance of the Bear model
    playlist.playlistId = req.body.playlistId;  // set the bears name (comes from the request)
    playlist.partyId = req.body.partyId;  // set the bears name (comes from the request)
    playlist.userEmail = req.body.userEmail;  // set the bears name (comes from the request)
  
    playlist.save(function (err) {
      if (err) { return next(err); }
  
      res.json({ message: 'playlist added!' });
    });
  });

// Start her up, boys
app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
