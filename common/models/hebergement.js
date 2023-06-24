'use strict';
const notify = require("../../server/global/notify")


module.exports = function(Hebergement) {


    Hebergement.creation = function (req, cb) {

        var hebergementBody = req.body.info; 
        var code = Math.floor(Date.now() / 1000);

        // 1. Create post
        Hebergement.create(hebergementBody, (err, hebergement) => {
              
            if(hebergement.typeHebergement == "HOTEL"){
                hebergement.updateAttributes({
                    codeHebergement: "H_" + code
                },(err, heber) =>{
                    console.log(heber)
                    if (err) cb(err, null)
                    else
                        cb(null, heber)
                })
            }
            else{

                hebergement.updateAttributes({
                    codeHebergement: "R_" + code
                },(err, heberge) =>{
                    console.log(heberge)
                    if (err) cb(err, null)
                    else
                        cb(null, heberge)
                })
            }
                        
                 
        });

    };

    Hebergement.remoteMethod('creation',
    {
        accepts:
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        http: { path: '/creation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    // approuver un hebergement
    Hebergement.approuve = function (id, cb) {

        const Provider = Hebergement.app.models.provider;
    
        Hebergement.findById(
            id,
            (err, hebergement) =>{
                console.log(hebergement)
                
                hebergement.updateAttributes({
                    approuveHebergement: true,
                    dateApprouve: Date.now(),
                    actifHebergement: true,
                    dateActif: Date.now()
                },(err, hebergement) =>{
    
                    Provider.findOne({
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
    
    
    Hebergement.remoteMethod('approuve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approuve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



    
    
    
    
    // activer un hebergement
    Hebergement.activeheberge = function (id, cb) {

        const Provider = Hebergement.app.models.provider;

        const messageServeur = Provider.app.models.messageServeur;

    
        Hebergement.findById(
            id,
            (err, hebergement) =>{
                console.log(hebergement)
                    hebergement.updateAttributes({
                        actifHebergement: true,
                        dateActif: Date.now(),
                    },(err, heberge) =>{

                        Provider.find({
                            where:{
                                id: hebergement.providerId
                                }
                            },(err, prod)=>{

                                messageServeur.create({
                                    objetMessage: "Activation",
                                    message: "Votre hébergement a été activé !" ,
                                    providerId: prod.id
                                },(err, messag)=>{

                                });
        
                            notify.sendPushNotification(
                                prod.device_fcm_token,
                                "Hébergement activé",
                                "Votre hébergement a été activé",
                                "PRO"
                                );
        
                            }
                        );

                        if(err) cb(err, null)
                        else
                        cb(null, heberge)
                    })
                
            })
    }
    
    
    Hebergement.remoteMethod('activeheberge',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/activeheberge', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    // desactiver un hebergement
    Hebergement.desactiveheberge = function (id, cb) {

        const Provider = Hebergement.app.models.provider;

        const messageServeur = Provider.app.models.messageServeur;
    
        Hebergement.findById(
            id,
            (err, hebergement) =>{
                console.log(hebergement)
                    hebergement.updateAttributes({
                        actifHebergement: false,
                        dateDesactif: Date.now(),
                    },(err, heberge) =>{

                        Provider.find({
                            where:{
                                id: hebergement.providerId
                                }
                            },(err, prod)=>{

                                messageServeur.create({
                                    objetMessage: "Désactivation",
                                    message: "Votre hébergement a été désactivé !" ,
                                    providerId: prod.id
                                },(err, messag)=>{

                                });
        
                                notify.sendPushNotification(
                                    prod.device_fcm_token,
                                    "Hébergement désactivé",
                                    "Votre hébergement a été désactivé",
                                    "PRO"
                                    );
        
                            }
                        );

                        if(err) cb(err, null)
                        else
                        cb(null, heberge)
                    })
                
            })
    }
    
    
    Hebergement.remoteMethod('desactiveheberge',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/desactiveheberge', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



    // afficher les hebergements actif
    Hebergement.afficheactif = function (cb) {

        Hebergement.find({
            where:{
                approuveHebergement: true,
                actifHebergement: true,
            },
            include:'provider'

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
                actifHebergement: false
            },
            include:'provider'

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




    // affiche un hebergement en attente si le provider est approuvé
    Hebergement.attente = function (cb) {

        Hebergement.find({
            where:{
                // couvertureHebergement: {neq:""},
                // nomProprio: {neq:""},
                // contactProprio: {neq:""},
                approuveHebergement: false
            },
            include:'provider'

        }, (err, hebergement) =>{

            
            console.log(hebergement)
            if(err) cb(err, null)
            else
                cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('attente',
    {
        http: { path: '/attente', verb: 'get'},
        returns : { type: 'object', root: true } 
    });




    // recherche d'hebergement avec les parametres
    Hebergement.rechercher=function (lat, lng, limit, skip, typeHebergement, lieuHebergement, km, prixMinimOffre, prixMaximOffre, cb) {

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
                actifHebergement: true,
                onlineHebergement: true,
                typeHebergement: typeHebergement,
                lieuHebergement: lieuHebergement,
                geoPointHebergement: {
                    near: userLocation,
                    maxDistance: km,
                    unit: 'kilometers',
                  },
            },
            include:[
                {
                    relation:'offres',
                    scope:{
                        where:{
                            actifOffre: true,
                            prixUnitaireOffre: {between: [prixMinimOffre,prixMaximOffre]},
                        },
                        limit:1
                    }
                }
                ],
        },
            (err, hebergement)=>{
                console.log(hebergement);
                if(err)cb(err, null)
                else{

                    var hebergements = hebergement.filter(e => e.offres.length > 0);
                    cb(null, hebergements);
                }
            }
        )
    }


    Hebergement.remoteMethod('rechercher', {
        accepts: [
            {arg: 'lat', type: 'string'},
            {arg: 'lng', type: 'string'},
            {arg: 'limit', type: 'string'},
            {arg: 'skip', type: 'string'},
            {arg: 'typeHebergement', type: 'string'},
            {arg: 'lieuHebergement', type: 'string'},
            {arg: 'km', type: 'string'},
            {arg: 'prixMinimOffre', type: 'string'},
            {arg: 'prixMaximOffre', type: 'string'}
        ],
        http:{ path: '/rechercher',verb:'get'},
        returns: {type: 'object', root: true}
    });




    // recherche d'hebergement proche
    Hebergement.proche=function (lat, lng, limit, skip, typeHebergement, cb) {

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
                actifHebergement: true,
                onlineHebergement: true,
                typeHebergement: typeHebergement,
                geoPointHebergement: {
                    near: userLocation
                  }
            },
            include:[
                {
                    relation:'offres',
                    scope:{
                        where:{
                            actifOffre: true,
                        },
                        limit:1
                    }
                }
                ],
        },
            (err, hebergement)=>{
                console.log(hebergement);
                if(err)cb(err, null)
                else{

                    var hebergements = hebergement.filter(e => e.offres.length > 0);
                    cb(null, hebergements);
                }
            }
        )
    }


    Hebergement.remoteMethod('proche', {
        accepts: [
            {arg: 'lat', type: 'string'},
            {arg: 'lng', type: 'string'},
            {arg: 'limit', type: 'string'},
            {arg: 'skip', type: 'string'},
            {arg: 'typeHebergement', type: 'string'}
        ],
        http:{ path: '/proche',verb:'get'},
        returns: {type: 'object', root: true}
    });




    // recherche d'hebergement par id
    Hebergement.heberById=function (hebergementId, cb) {


        Hebergement.findById(hebergementId,{
            where:{
                approuveHebergement: true,
                actifHebergement: true,
                onlineHebergement: true
            },
            include:[
                {
                    relation:'offres',
                    scope:{
                        where:{
                            actifOffre: true,
                        },
                    }
                }
                ],
        },
            (err, hebergement)=>{
                console.log(hebergement);
                if(err)cb(err, null)
                else
                    cb(null, hebergement);
            }
        )
    }


    Hebergement.remoteMethod('heberById', {
        accepts:{arg: 'hebergementId', type: 'string'}
        ,
        http:{ path: '/:hebergementId/heberById',verb:'get'},
        returns: {type: 'object', root: true}
    });





};
