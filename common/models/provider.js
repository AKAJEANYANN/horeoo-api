'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Provider) {

    // creation du compte client
    Provider.phonenumber = function (req ,cb) {
        
        var phoneProvider = req.body.phoneProvider;
        var code = req.body.code;
    
        if(phoneProvider != null && phoneProvider != undefined && phoneProvider != ""){
    
            Provider.findOne({
            where: {
                phoneProvider: phoneProvider,
            }
        }, (err, provider) => {
    
            console.log(provider);
    
            // cas 1 l'utilisateur existe: 
            if(provider){
                    // 2 mettre a jour le MDP avec le code de 5 chiffre

                    provider.updateAttributes({
                        email : phoneProvider + '@horeoo.ci',
                        password : `${code}`
                    },(err, provider) => {
                        console.log(provider);
                        
                        // Retourner une reponse
                        if(err) cb(err, null)
                        else 
                        cb(null, provider);
    
                })
                
            }
            // cas 2 l'utilsiateur n'existe pas
            else {
                // 2 creer l'utilisateur avec son numero de tel 
    
                Provider.create(
                    {
                        username: phoneProvider,
                        phoneProvider: phoneProvider,
                        email : phoneProvider + '@horeoo.ci',
                        password : `${code}`,
                    },
                    (err, Provider) => {
                        console.log(Provider)
                        
                        // Retourner une reponse
                        if(err) cb(err, null);
                        else cb(null, Provider);
                                           
                    }
                )
               
            }
        })
    }
    else{
        cb("Veuillez entrer le numéro de téléphone", null)
    } 
    
    };

    
    
    Provider.remoteMethod('phonenumber',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/phonenumber', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





     // creation de compte par sms
    Provider.number = function (req ,cb) {

        const message = "Votre code de connexion est : " ;
        var msisdn = req.body.msisdn;

        var code = Math.floor(Math.random() * 9000) + 1000;
        // var code = (msisdn != null && msisdn != undefined && msisdn != "+2250748443404" && msisdn != "+2250544727272" && msisdn != "+2250709128585") ?  Math.floor(Math.random() * 9000) + 1000 : 1111;

        if(msisdn != null && msisdn != undefined && msisdn != ""){

            Provider.findOne({
                where: {
                    phoneProvider: msisdn,
                }
            }, (err, user) => {

                // cas 1 l'utilisateur existe: 
                if(user){
                    
                    // mettre a jour le MDP avec le code de 5 chiffre
                    user.updateAttributes({
                        email : msisdn + '@horeoo.ci',
                        password : `${code}`
                    },(err, use) => {
                        console.log(use);
                        if(err) cb(err, null)
                        else {
                            // TODO : Envoyer SMS
                            notify.sendSMS(msisdn, message + code);
                            
                            // Retourner une reponse
                            cb(null, [message + code, use]);
                        } 
                    })            
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Provider.create(
                        {
                            phoneProvider: msisdn,
                            email : msisdn + '@horeoo.ci',
                            password : `${code}`,
                        },
                        (err, user) => {
                            if(err) cb(err, null);
                            else{ 
                                // Retourner une reponse
                                cb(null, [message + code, user]);
                                // TODO : Envoyer SMS
                                 notify.sendSMS(msisdn, message + code);   
                                }
                            
                                            
                        }
                    ) 
                }
            })
        }
        else{
            cb({status: 401, message: "Veuillez entrer le numéro de téléphone"}, null)
        } 
    };

    Provider.remoteMethod('number',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/number', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
