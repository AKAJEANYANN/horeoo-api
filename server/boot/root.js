// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const notify = require('../global/notify'); 

module.exports = function(server) {
  var ds = server.dataSources.horeooAppDb;
  if(ds.connected) {
    ds.autoupdate();
  } else {
    ds.once('connected', function() {
      ds.autoupdate();
    });
  }

  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
