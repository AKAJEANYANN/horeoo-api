'use strict';

module.exports = function(Restaurant) {

    Restaurant.rechercheResto = function (lat, lng, limit, skip, category, cb) {
    
        var loopback = require('loopback');
        var userLocation = new loopback.GeoPoint({
            lat: lat,
            lng: lng
          });
    
    
          Restaurant.find({
            limit: limit,
            skip: skip,
            where:{
                localisation: {
                    near: userLocation
                  },
                category: category

            }
    
        },(err, recherche) =>{
            console.log(recherche);
            if (err) cb(err, null)
            else{
                cb(null, recherche);
             }
            },
        )
    }
    
    Restaurant.remoteMethod('rechercheResto', {
        accepts: [
                {arg: 'lat', type: 'string'},
                {arg: 'lng', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'category', type: 'string'},
            ],
        http:{ path: '/rechercheResto',verb:'get'},
        returns: {type: 'object', root: true}
    });

    
};
