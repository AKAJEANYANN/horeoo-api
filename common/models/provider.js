'use strict';

module.exports = function(Provider) {

    // creation du compte client
    Provider.phonenumber = function (req ,cb) {
        
        const Hebergement = Provider.app.models.hebergement;
        var phoneProvider = req.body.phoneProvider;
        var code =  req.body.code;
    
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





     //create user with verification number 2
     Provider.writenumberconnect = function (req ,cb) {

        const message = "Votre code de connexion est : " ;
        const Hebergement = Provider.app.models.hebergement;
        var phoneProvider = req.body.phoneProvider;
        var code =  req.body.code;
        var userCodeCommercial = req.body.codeCommercial;
        var code =  Math.floor(Math.random() * 9000) + 1000;
    
        if(phoneProvider != null && phoneProvider != undefined && phoneProvider != ""){
    
        Provider.findOne({
            where: {
                phoneProvider: phoneProvider
            }
        }, (err, user) => {
    
            console.log([user, code]);
    
            // cas 1 l'utilisateur existe: 
            if(user){
                // reset sur le mdp
                // user.resetPassword({
                //     email : user.email
                // }, (err, usereset) =>{
                //     console.log(usereset);
                         // 2 mettre a jour le MDP avec le code de 5 chiffre
                    user.updateAttributes({
                        email : phoneProvider + '@horeoo.ci',
                        password : `${code}`
                },(err, use) => {
                    console.log(use);
                    // TODO : Envoyer SMS
                    notify.sendSMS(phoneProvider, message + code);
    
                    // Retourner une reponse
                    if(err) cb(err, null)
                    else 
                    cb(null, message + code);
    
                })
                // })
                
            }
            // cas 2 l'utilsiateur n'existe pas
            else {
                // 2 creer l'utilisateur avec son numero de tel 
    
                Provider.create(
                    {
                        username : phoneProvider,
                        email : phoneProvider + '@moya.ci',
                        password : `${code}`,
                    },
                    (err, user) => {
                        // TODO : Envoyer SMS
                        notify.sendSMS(phoneProvider, message + code);
                        
                        // Retourner une reponse
                        if(err) cb(err, null);
                        else cb(null, message + code);
                                           
                    }
                )
               
            }
        })
    }
    else{
        cb({status: 401, message: "Veuillez entrer le numéro de téléphone"}, null)
    } 
    
    
        };
    
        Provider.remoteMethod('writenumberconnect',
        {
            accepts: [
                { arg: 'req', type: 'object', 'http': {source: 'req'}},
            ],
            http: { path: '/writenumberconnect', verb: 'post'},
            returns : { type: 'object', root: true } 
        });
};
