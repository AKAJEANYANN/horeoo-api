'use strict';

module.exports = function(Hebergement) {

    Hebergement.approuve = function (id, cb) {

        const Provider = Hebergement.app.models.hebergement;
    
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
    
    
    Hebergement.remoteMethod('approuve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approuve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
    
    
    
    
    Hebergement.activeheberge = function (id, cb) {

        const Provider = Hebergement.app.models.hebergement;
    
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





    Hebergement.desactiveheberge = function (id, cb) {

        const Provider = Hebergement.app.models.hebergement;
    
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

};
