'use strict';
const notify = require("../../server/global/notify")


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


  



Hebergement.approve = function (id, cb) {

    const Provider = Hebergement.app.models.hebergement;

    Hebergement.findById(
        id,
        (err, hebergement) =>{
            console.log(hebergement)
            
            hebergement.updateAttributes({
                approuveHebergement: true,
                approval_datetime: Date.now()
            },(err, hebergement) =>{

                Provider.find({
                    where:{
                        id: hebergement.providerId
                        }
                    },(err, prod)=>{

                    notify.sendPushNotification(
                            prod.device_fcm_token,
                            "Hébergement approuvé",
                            "Votre hébergement a été approuvé",
                            "PRO"
                            );

                    }
                );

                if(err) cb(err, null)
                else
                    cb(null, hebergement)
            });

        })
}


Hebergement.remoteMethod('approve',
{
    accepts: { arg: 'id', type: 'string' },
    http: { path: '/:id/approve', verb: 'post'},
    returns : { type: 'object', root: true } 
});





Hebergement.actif = function (id, cb) {

    Hebergement.findById(
        id,
        (err, hebergement) =>{
            console.log(hebergement)
                hebergement.updateAttributes({
                    activeHebergement: true,
                },(err, heberge) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, heberge)
                })
            
        })
}


Hebergement.remoteMethod('actif',
{
    accepts: { arg: 'id', type: 'string' },
    http: { path: '/:id/actif', verb: 'post'},
    returns : { type: 'object', root: true } 
});




    Hebergement.mapProvider = function (lat, lng, limit, skip, providerId, km,  typeHebergementId, cb) {
    
        var loopback = require('loopback');
        var userLocation = new loopback.GeoPoint({
            lat: lat,
            lng: lng
        });


        Hebergement.find({
            limit: limit,
            skip: skip,
            where:{
                providerId: providerId,
                activeHebergement: true,
                locationHebergement: {
                    near: userLocation,
                    maxDistance: km,
                    unit: 'kilometers'
                },
                typeHebergementId: typeHebergementId
            },
            include:[
                {
                    relation:'offre',
                    scope:{
                    where:{
                        activeOffre: true,
                        visibleOffre: true,
                    },
                        limit:1
                    }
                }
                ]

                },(err, hebergement) =>{
                    if(err) cb(err, null)
                    else
                        cb(null, hebergement)
                })
            }

    Hebergement.remoteMethod('mapProvider', {
        accepts: [
                {arg: 'lat', type: 'string'},
                {arg: 'lng', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'providerId', type: 'string'},
                {arg: 'km', type: 'string'},
                {arg: 'typeHebergementId', type: 'string'}
            ],
        http:{ path: '/mapProvider',verb:'get'},
        returns: {type: 'object', root: true}
    });



    //api pour afficher la map
    Hebergement.map = function (lat, lng, limit, skip, providerId, km,  typeHebergementId, cb) {
    
        
            var loopback = require('loopback');
            var userLocation = new loopback.GeoPoint({
                lat: lat,
                lng: lng
            });


        Hebergement.find({
            limit: limit,
            skip: skip,
            where:{
                providerId: providerId,
                activeHebergement: true,
                approuveHebergement: true,
                locationHebergement: {
                    near: userLocation,
                    maxDistance: km,
                    unit: 'kilometers'
                },
                typeHebergementId: typeHebergementId
            },
            include:[
                {
                    relation:'offre',
                    scope:{
                        where:{
                            activeOffre: true,
                            visibleOffre: true,
                        },
                        limit:1
                    }
                }
                ],

                },(err, hebergement) =>{
                    console.log(hebergement);
                    if(err)cb(err, null)
                        cb(null, hebergement) 

                })
            }

        Hebergement.remoteMethod('map', {
            accepts: [
                    {arg: 'lat', type: 'string'},
                    {arg: 'lng', type: 'string'},
                    {arg: 'limit', type: 'string'},
                    {arg: 'skip', type: 'string'},
                    {arg: 'providerId', type: 'string'},
                    {arg: 'km', type: 'string'},
                    {arg: 'typeHebergementId', type: 'string'}
                ],
            http:{ path: '/map',verb:'get'},
            returns: {type: 'object', root: true}
        });




        //affichage des hebergement non liés

    Hebergement.nonlier = function (cb) {
    

        Hebergement.find({
            where:{
                providerId:"AUCUN",
            }
        }, (err, hebergement)=>{
            if (err) cb(err, null)
            else{
                cb(null, hebergement);

             }
            })
           
        }

    Hebergement.remoteMethod('nonlier', {
        http:{ path: '/nonlier',verb:'get'},
        returns: {type: 'object', root: true}
    });




        
    Hebergement.affiche = function (cb) {

        Hebergement.find({
            where:{
                approuveHebergement: false,
                couvertureHebergement: {neq:""},
                nomProprio: {neq:""},
                contactProprio: {neq:""},
                
            },
            include:['provider','typeHebergement','commercial']

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





    Hebergement.afficheattente = function (cb) {

        Hebergement.find({
            where:{
                couvertureHebergement: {neq:""},
                nomProprio: {neq:""},
                contactProprio: {neq:""},
                approuveHebergement: false
            },
            include:['provider','typeHebergement','commercial']

        }, (err, hebergement) =>{
            console.log(hebergement)
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('afficheattente',
    {
        http: { path: '/afficheattente', verb: 'get'},
        returns : { type: 'object', root: true } 
    });




    Hebergement.afficheactif = function (cb) {

        Hebergement.find({
            where:{
                approuveHebergement: true,
                activeHebergement: true
            },
            include:['provider','typeHebergement','commercial']

        }, (err, hebergement) =>{
            console.log(hebergement)
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('afficheactif',
    {
        http: { path: '/afficheactif', verb: 'get'},
        returns : { type: 'object', root: true } 
    });



    //affichage des hebergements desactivés
    Hebergement.affichedesactif = function (cb) {

        Hebergement.find({
            where:{
                approuveHebergement: true,
                activeHebergement: false
            },
            include:['provider','typeHebergement','commercial']

        }, (err, hebergement) =>{
            console.log(hebergement)
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('affichedesactif',
    {
        http: { path: '/affichedesactif', verb: 'get'},
        returns : { type: 'object', root: true } 
    });





    Hebergement.mapfilter = function (lat, lng, limit, skip, onlineHebergement, nombrePiece, km,  typeHebergementId, prixMinimOffre, prixMaximOffre, cb) {
    
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
                nombrePiece: nombrePiece,
                approuveHebergement: true,
                locationHebergement: {
                    near: userLocation,
                    maxDistance: km,
                    unit: 'kilometers'
                  },
                typeHebergementId: typeHebergementId,
            },
            include:[
                {
                relation:'provider',
                scope:{
                   where:{
                    activeProvider: true,
                    approuveProvider: true,
                   }
                }
            },
                {
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
        ]
    
        },(err, hebergement) =>{
            if (err) cb(err, null)
            else{
                const hebergements = hebergement.filter(e => e.offre.length > 0);
                cb(null, hebergements);

             }
            },
        )
    }
    
    Hebergement.remoteMethod('mapfilter', {
        accepts: [
                {arg: 'lat', type: 'string'},
                {arg: 'lng', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'onlineHebergement', type: 'string'},
                {arg: 'nombrePiece', type: 'string'},
                {arg: 'km', type: 'string'},
                {arg: 'typeHebergementId', type: 'string'},
                {arg: 'prixMinimOffre', type: 'string'},
                {arg: 'prixMaximOffre', type: 'string'}
            ],
        http:{ path: '/mapfilter',verb:'get'},
        returns: {type: 'object', root: true}
    });





    Hebergement.rechercheParNom = function (denominationHebergement,typeHebergementId, cb) {
        
    
        Hebergement.find({
            where:{
                approuveHebergement: true,
                denominationHebergement: {like: `%${denominationHebergement}%`},     
                typeHebergementId: typeHebergementId
            },
            include:[
                {
                relation:'offre',
                scope:{
                   where:{
                    activeOffre: true,
                    visibleOffre: true,
                   },
                   limit:1
                }
            }
        ]
    
        },(err, hebergement) =>{
            if (err) cb(err, null)
            else{
                const hebergements = hebergement.filter(e => e.offre.length > 0);
                cb(null, hebergements);

             }
            },
        )
    }
    
    Hebergement.remoteMethod('rechercheParNom', {
        accepts: [
                {arg: 'denominationHebergement', type: 'string'},
                {arg: 'typeHebergementId', type: 'string'}
            ],
        http:{ path: '/rechercheParNom',verb:'get'},
        returns: {type: 'object', root: true}
    });





    Hebergement.countTypeHeber = function (typeHebergementId, cb) {

            var countTypeHeber = 0;

        Hebergement.find({
           
            where:{
                typeHebergementId: typeHebergementId
                  
            }
        }
            ,
           (err, heber)=>{

            console.log(heber);
            if(heber){
                countTypeHeber = heber.length;
                cb(null, countTypeHeber)
            }
            // if(err) cb(err, null)
            // else
            //     cb(null, heber)
           
            })
    }
    
    
    Hebergement.remoteMethod('countTypeHeber',
    {
        accepts: { arg: 'typeHebergementId', type: 'string' },
        http: { path: '/countTypeHeber', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    Hebergement.countReserv = function (providerId, reservationEtat, cb) {

        var countReserv = 0;

    Hebergement.find({
       
        where:{
            providerId: providerId
                
        },
        include:{
            relation: 'reservations',
            scope:{
                where:{
                    reservationEtat: reservationEtat
                }
            }
        }
    }
        ,
       (err, heberge)=>{

        console.log(heberge);
            if(heberge.reservations){
                countReserv = heberge.length;
                cb(null, countReserv)
            }
       
        })
}


    Hebergement.remoteMethod('countReserv',
        {
            accepts: [{ arg: 'providerId', type: 'string' },
             { arg: 'reservationEtat', type: 'string' }],
            http: { path: '/countReserv', verb: 'get'},
            returns : { type: 'object', root: true } 
        });




        
    Hebergement.countReservation = function (providerId, etat, cb) {

        var sql;

        var ds = Hebergement.dataSource;
        if (providerId != "" && etat != "") {
            sql = `SELECT COUNT(reservation.hebergementId) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' AND reservation.reservationEtat = '${etat}'`;
        }
        else {
            sql = `SELECT COUNT(*) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' AND reservation.reservationEtat = '${etat}'`;
        }
        
        ds.connector.query(sql, function (err, data){
            if(err) throw err
            
            cb(null, data);
        });
}


    Hebergement.remoteMethod('countReservation',
        {
            accepts:[ { arg: 'providerId', type: 'string' },
                { arg: 'etat', type: 'string' }
         ],
            http: { path: '/countReservation', verb: 'get'},
            returns : { type: 'object', root: true } 
        });





        Hebergement.etatReservationHebergement = function (idProvider, etatReservation, cb) {
            
            Hebergement.find(
                {
                where:{
                    activeHebergement: true,
                    providerId: idProvider
                    },
                    include:[
                    {
                        relation:'reservations',  
                            scope:{
                            where:{
                                // id: {neq:""},
                                reservationEtat: etatReservation
                            }
                        }
                    },
                    {
                        relation:'offre',
                        scope:{
                            where:{
                            // prixOffre: {between: [prixMinimOffre,prixMaximOffre]},
                            activeOffre: true,
                            visibleOffre: true,
                            },
                            limit:1
                        }
                    }
                ]
    
                },
                (err, hebergement) =>{
                    console.log(hebergement);
                    if(err) cb(err, null)
                    else{
                        const hebergements = hebergement.filter(e => e.reservations.length > 0 );

                        cb(null, hebergements);
                    }
                  
                })
        }
        
        
        Hebergement.remoteMethod('etatReservationHebergement',
        {
            accepts: [
                    { arg: 'idProvider', type: 'string' },
                    { arg: 'etatReservation', type: 'string' }
                ],
            http: { path: '/etatReservationHebergement', verb: 'get'},
            returns : { type: 'object', root: true } 
        });



};
