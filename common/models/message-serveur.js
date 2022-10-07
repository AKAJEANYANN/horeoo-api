'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Messageserveur) {

    //messge de refus d'un provider
    Messageserveur.refusProvider = function (req, idProvider, cb) {
        
        var messageServeurBody = req.body.messageServeurBody; 

        const Provider = Messageserveur.app.models.provider;

        Messageserveur.create({
            objetMessage: messageServeurBody.objetMessage,
            message: messageServeurBody.message,
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
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'idProvider', type: 'string' }],
        http: { path: '/:idProvider/refusProvider', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
