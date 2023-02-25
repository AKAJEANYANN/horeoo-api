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
    
    
    
    
    Hebergement.actif = function (id, cb) {
    
        Hebergement.findById(
            id,
            (err, hebergement) =>{
                console.log(hebergement)
                    hebergement.updateAttributes({
                        actifHebergement: true,
                        dateActif: Date.now(),
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

};
