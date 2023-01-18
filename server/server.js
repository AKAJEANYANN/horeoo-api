'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
require('dotenv').config();

app.start = function() {
  // start the web server
  var port = process.env.PORT || 3000;
  return app.listen(port, function() {
    app.emit('started');
    //var baseUrl = app.get('url').replace(/\/$/, '');
    // if (app.get('loopback-component-explorer')) {
      // var explorerPath = app.get('loopback-component-explorer').mountPath;
    console.log('Horeoo Rest API is alive at %s', app.get('url'));
    // }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});