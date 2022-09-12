// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = function(server) {
  // server.dataSources.horeooAppDb.autoupdate();

  // var ds = server.dataSources.horeooAppDb;
  // if(ds.connected) {
  //   ds.autoupdate();
  // } else {
  //   ds.once('connected', function() {
  //     ds.autoupdate();
  //   });
  // }



  const appDataSources = [
    app.dataSources.horeooAppDb
  ]
  
  (async () => {
    for (let i = 0; i < appDataSources.length; i++) {
      const ds = appDataSources[ i ]
  
      if (ds.autoupdate) {
        await new Promise((resolve, reject) => {
          ds.autoupdate(err => {
            if (err) return reject(err)
            resolve()
          })
        })
      }
    }
  })()
  
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
