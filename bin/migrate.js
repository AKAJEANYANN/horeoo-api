var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.horeooAppDb;

if (ds.connected) {
    updateDatabase(ds)
} else {
    ds.once('connected', function () {
        updateDatabase(ds);
    });
}

function updateDatabase(ds) {
    ds.autoupdate(null, function (err) {
        if (err) throw err;
        console.log('Finished migration');
        ds.disconnect();
    });
}
