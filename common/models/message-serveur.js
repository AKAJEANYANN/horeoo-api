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

                        })
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

                cb(null, message);
            }
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

};
