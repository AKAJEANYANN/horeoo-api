'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Commercial) {


    // creation d'un commercial avec generation de code commercial
    Commercial.creation = function (req ,cb) {

        var infoData = req.body.data;

        var codeCom = Math.floor(Math.random() * 90000) + 10000;

        const message = "Votre code commercial est : " ;


        
        if(infoData != null && infoData != undefined && infoData != ""){

            Commercial.create(infoData, (err, commercial) => {

                    commercial.updateAttributes({
                        code : commercial.nom + codeCom
                    },(err, com) => {
                        console.log(com.numero);
                        if(err) cb(err, null)
                        else{

                            // TODO : Envoyer SMS
                            notify.sendSMS(message + com.code, com.numero);
                            
                            // Retourner une reponse
                            cb(null, [message + com.code, com]);
                        }


                        // notification au commercial
                        // notify.sendPushNotification(
                        //     com.device_fcm_token,
                        //     "Compte créé",
                        //     "Votre compte est créé",
                        //     "COM"
                        //     );
                        
                        })            
                
            })
        }
        else{
            cb({status: 401, message: "Veuillez entrer les informations du commercial"}, null)
        } 
        
    };

    Commercial.remoteMethod('creation',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/creation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
