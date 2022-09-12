// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = function(server) {
  server.dataSources.horeooAppDb.autoupdate();

  var ds = server.dataSources.horeooAppDb;
  if(ds.connected) {
    ds.autoupdate();
  } else {
    ds.once('connected', function() {
      ds.autoupdate();
    });
  }
  
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
