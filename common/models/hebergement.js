'use strict';

module.exports = function(Hebergement) {

    // afficher un certain nombre d'hebergement avec typeHebergement
    Hebergement.random = function (limit, idTypeHebergement, cb) {
        // var ds = Hebergement.dataSource;
        // var sql = `SELECT * FROM hebergement ORDER BY RAND() LIMIT ${limit}`;

        // ds.connector.query(sql, function (err, data){
        //     if(err) throw err

        //     cb(null, data);
        // });
        Hebergement.find({
            limit: limit,
            include:{
                relation: "offre",
                scope:{
                    limit:1,
                    where:{
                        activeOffre: true
                    }
                }
            },
            where:{
                typeHebergementId: idTypeHebergement
            }
        },(err, hebergement) =>{
            if(err) cb(err, null)
            else cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('random', {
        accepts: [{arg: 'limit', type: 'string'},
        {arg: 'idTypeHebergement', type: 'string'}],
        http:{ path: '/random',verb:'get'},
        returns: {type: 'object', root: true}
  });




  Hebergement.liked = function (customerId, cb) {
        
    const Hebergementhascustomer = Hebergement.app.models.hebergementhascustomer;

    Hebergement.find({
        where:{
            customerId: customerId
        }
    })
}

  Hebergement.remoteMethod('liked', {
    accepts: {arg: 'customerId', type: 'string'},
    http:{ path: '/liked',verb:'get'},
    returns: {type: 'object', root: true}
});
  



Hebergement.approve = function (id, cb) {
    Hebergement.findById(
        id,
        (err, hebergement) =>{
            console.log(hebergement)
            hebergement.updateAttributes({
                approuveHebergement: true,
                approval_datetime: Date.now()
            },(err, heberge) =>{
                if(err) cb(err, null)
                else
                cb(null, heberge)
            })
        })
}


Hebergement.remoteMethod('approve',
{
    accepts: { arg: 'id', type: 'string' },
    http: { path: '/:id/approve', verb: 'post'},
    returns : { type: 'object', root: true } 
});




Hebergement.map = function (lat, lng, limit, skip, km,  typeHebergementId, cb) {
    
    var loopback = require('loopback');
    var userLocation = new loopback.GeoPoint({
        lat: lat,
        lng: lng
      });


    Hebergement.find({
        limit: limit,
        skip: skip,
        where:{
            approuveHebergement: true,
            locationHebergement: {
                near: userLocation,
                maxDistance: km,
                unit: 'kilometers'
              },
            typeHebergementId: typeHebergementId
        },
        include:{
            relation:'offre',
            scope:{
               where:{
                activeOffre: true,
                visibleOffre: true,
               },
                limit:1
            }
        }

    },(err, hebergement) =>{
        if(err) cb(err, null)
        else
            cb(null, hebergement)
    })
}

Hebergement.remoteMethod('map', {
    accepts: [
            {arg: 'lat', type: 'string'},
            {arg: 'lng', type: 'string'},
            {arg: 'limit', type: 'string'},
            {arg: 'skip', type: 'string'},
            {arg: 'km', type: 'string'},
            {arg: 'typeHebergementId', type: 'string'}
        ],
    http:{ path: '/map',verb:'get'},
    returns: {type: 'object', root: true}
});




    Hebergement.affiche = function (cb) {

        Hebergement.find({

            include:'provider'

        }, (err, hebergement) =>{
            console.log(hebergement)
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('affiche',
    {
        http: { path: '/affiche', verb: 'get'},
        returns : { type: 'object', root: true } 
    });





    Hebergement.mapfilter = function (lat, lng, limit, skip, onlineHebergement, km,  typeHebergementId, prixMinimOffre, prixMaximOffre, cb) {
    
        var loopback = require('loopback');
        var userLocation = new loopback.GeoPoint({
            lat: lat,
            lng: lng
          });
    
    
        Hebergement.find({
            limit: limit,
            skip: skip,
            where:{
                onlineHebergement: onlineHebergement,
                approuveHebergement: true,
                locationHebergement: {
                    near: userLocation,
                    maxDistance: km,
                    unit: 'kilometers'
                  },
                typeHebergementId: typeHebergementId
            },
            include:{
                relation:'offre',
                scope:{
                   where:{
                    prixOffre: {between: [prixMinimOffre,prixMaximOffre]},
                    activeOffre: true,
                    visibleOffre: true,
                   },
                   limit:1
                }
            }
    
        },(err, hebergement) =>{
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }
    
    Hebergement.remoteMethod('mapfilter', {
        accepts: [
                {arg: 'lat', type: 'string'},
                {arg: 'lng', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'onlineHebergement', type: 'string'},
                {arg: 'km', type: 'string'},
                {arg: 'typeHebergementId', type: 'string'},
                {arg: 'prixMinimOffre', type: 'string'},
                {arg: 'prixMaximOffre', type: 'string'}
            ],
        http:{ path: '/mapfilter',verb:'get'},
        returns: {type: 'object', root: true}
    });
};
