'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Messageserveur) {

    // envoie message a un provider avec suppresion du contenu du champ approuve
    Messageserveur.postMessage= function (req, cb) {

        const Provider = Messageserveur.app.models.provider;
        
        var objetMessage= req.body.objetMessage;
        var message= req.body.message;
        var providerId= req.body.providerId;
        
        Messageserveur.create({
            objetMessage: objetMessage,
            message: message,
            providerId: providerId,
        },(err, message) =>{
            if(err) cb(err, null);
            else{
                Provider.findOne({
                    where:{
                        id: message.providerId
                    }
                },(err, provider) =>{
                        provider.updateAttributes({
                            approuve:""
                        },(err, pro)=>{

                            notify.sendPushNotification(
                                pro.device_fcm_token,
                                "Provider non approuvé",
                                "Votre compte provider n'a pas été approuvé",
                                "PRO"
                                );
                            
                        });
                    }
                    
                );

                cb(null, message);
            }
        })
        
    }



    Messageserveur.remoteMethod('postMessage',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/postMessage', verb: 'post'},
        returns : { type: 'object', root: true } 
    });






    // envoie message a un provider pour non approbation de son hebergement
    Messageserveur.postMessageHeberge= function (req, cb) {

        const Provider = Messageserveur.app.models.provider;
        
        var objetMessage= req.body.objetMessage;
        var message= req.body.message;
        var providerId= req.body.providerId;
        
        Messageserveur.create({
            objetMessage: objetMessage,
            message: message,
            providerId: providerId,
        },(err, message) =>{
            if(err) cb(err, null);
            else{
                Provider.findOne({
                    where:{
                        id: message.providerId
                    }
                },(err, provider) =>{
                        
                    notify.sendPushNotification(
                        provider.device_fcm_token,
                        "Hébergement non approuvé",
                        "Votre hébergement n'a pas été approuvé",
                        "PRO"
                        );
                    }
                    
                );

            }
            cb(null, message);
        })
        
    }



    Messageserveur.remoteMethod('postMessageHeberge',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/postMessageHeberge', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    // Messageserveur.postMessageHeberge= function (req, cb) {
        
    //     const Provider = Messageserveur.app.models.provider;
        
    //     var objetMessage= req.body.objetMessage;
    //     var message= req.body.message;
    //     var providerId= req.body.providerId;
        
    //     Messageserveur.create({
    //         objetMessage: objetMessage,
    //         message: message,
    //         providerId: providerId,
    //     },(err, message) =>{
    //         if(err) cb(err, null);
    //         else{
    //             Provider.findOne({
    //                 where:{
    //                     id: message.providerId
    //                 }
    //             },(err, provider) =>{
                        
    //                 notify.sendPushNotification(
    //                     provider.device_fcm_token,
    //                     "Hébergement non approuvé",
    //                     "Votre hébergement n'a pas été approuvé",
    //                     "PRO"
    //                     );
    //                 }
                    
    //             );

    //             cb(null, message);
    //         }
    //     })
        
    // }



    // Messageserveur.remoteMethod('postMessageHeberge',
    // {
    //     accepts: [
    //         { arg: 'req', type: 'object', 'http': {source: 'req'}},
    //     ],
    //     http: { path: '/postMessageHeberge', verb: 'post'},
    //     returns : { type: 'object', root: true } 
    // });




    // envoie un message au client apres un paiement
    Messageserveur.notifpaiement= function (req, cb) {
        
        var isProvider = req.body.isProvider;

        var montant = req.body.montant;

        var clientId = req.body.clientId;
        
        Messageserveur.create({
            objetMessage: " Paiement reussie",
            message: " Votre paiement de " + montant +" FCFA a été enregistré avec succès"
        },(err, message) =>{
            console.log(message)
            if(err) cb(err, null);

            else if(isProvider == true){
                    message.updateAttributes({
                        providerId: clientId
                    },(err, pro)=>{
                        console.log(pro);
                        if(err)cb(err, null)
                        else
                            cb(null, "message envoyé");

                        notify.sendPushNotification(
                            pro.device_fcm_token,
                            "Paiement reussie",
                            "Votre paiement a été enregistré",
                            "PRO"
                            );
                    });
                } 
                else {
                        message.updateAttributes({
                            customerId: clientId
                        },(err, cust)=>{
                            console.log(cust);
                            if(err)cb(err, null)
                            else
                                cb(null, "message envoyé");

                            notify.sendPushNotification(
                                cust.device_fcm_token,
                                "Paiement reussie",
                                "Votre paiement a été enregistré",
                                "PRO"
                                );
                            })
                        }
        })
        
    }



    Messageserveur.remoteMethod('notifpaiement',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/notifpaiement', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
