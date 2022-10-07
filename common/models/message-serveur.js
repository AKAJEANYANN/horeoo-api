'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Messageserveur) {

    //messge de refus d'un provider
    Messageserveur.refusProvider = function (objetMessage,message, idProvider, cb) {
        

        const Provider = Messageserveur.app.models.provider;

        Messageserveur.create({
            objetMessage: objetMessage,
            message: message,
            providerId: idProvider
        },
            (err, mess) =>{
                console.log(mess);
                if(err) cb(err, null)
                else{
                    Provider.findById(idProvider,
                        (err, pro) =>{
                            notify.sendPushNotification(
                                pro.device_fcm_token,
                                "Refus d'approbation",
                                "Votre compte fournisseur n'a pas été approuvé",
                                "PRO"
                                );
                        });

                        cb(null, mess);
                }

            })
    }
    
    
    Messageserveur.remoteMethod('refusProvider',
        {
        accepts: [
            { arg: 'objetMessage', type: 'string'},
            { arg: 'message', type: 'string',},
            { arg: 'idProvider', type: 'string' }],
        http: { path: '/:idProvider/refusProvider', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
