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
        var numdemo = "+2250011223344";
        var commercialId = req.body.commercialId;
        const messageServeur = Provider.app.models.messageServeur;
        
        function sendMessageServeur(msg ="Félicitation nouveau fournisseur ajouté !" , obj ="Ajout fournisseur") {
            messageServeur.create( {
                message: msg,
                objetMessage: obj,
                vueMessage: false,
                commercialId: commercialId,
              }
            ,(err, mess)=>{
    
            }) 
        }

        
        // var code = Math.floor(Math.random() * 9000) + 1000;
        var code = (msisdn != null && msisdn != undefined && msisdn != numdemo) ?  Math.floor(Math.random() * 9000) + 1000 : 1111;

        if(msisdn != null && msisdn != undefined && msisdn != ""){

            Provider.findOne({
                where: {
                    username : msisdn,
                    phoneProvider: msisdn,
                }
            }, (err, user) => {

                // cas 1 l'utilisateur existe: 
                if(user){
                    
                    // mettre a jour le MDP avec le code de 5 chiffre
                    user.updateAttributes({
                        email : msisdn + '@horeoo.com',
                        password : `${code}`
                    },(err, use) => {
                        console.log(use);
                        if(err) cb(err, null)
                        else if (msisdn != numdemo) {
                            // TODO : Envoyer SMS
                            notify.sendSMS(msisdn, message + code);
                            if(commercialId !=""){
                                sendMessageServeur("Le compte fournisseur existe déjà !")
                           }
                            // Retourner une reponse
                            cb(null, [message + code, use]);
                        } 
                        else{
                            cb(null, [message + code, use]);
                        }
                    })            
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Provider.create(
                        {
                            username : msisdn,
                            phoneProvider: msisdn,
                            commercialId: commercialId,
                            email : msisdn + '@horeoo.com',
                            password : `${code}`,
                        },
                        (err, user) => {
                            if(err) cb(err, null);
                            else if (msisdn != numdemo){ 
                                // Retourner une reponse
                                cb(null, [message + code, user]);
                                // TODO : Envoyer SMS
                                 notify.sendSMS(msisdn, message + code); 
                                    if(commercialId !=""){
                                        sendMessageServeur()
                                   }
                                } 
                                else{
                                    cb(null, [message + code, user]);
                                };
                                
                                notify.sendPushNotification(
                                    user.device_fcm_token,
                                    "Provider créer",
                                    "Votre compte à été crée",
                                    "PRO"
                                    );
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




    Provider.affiche = function (cb) {
        
        Provider.find({
            include:
                {
                    relation:'hebergements'
                }
            
        }, (err, provider) =>{
            console.log(provider)
            if(err) cb(err, null)
            else
                cb(null, provider);
        })
    }


    Provider.remoteMethod('affiche',
    {
        http:{ path: '/affiche',verb:'get'},
        returns : { type: 'object', root: true } 
    });



    
    Provider.afficheDemandeApprouve = function (cb) {
        
        Provider.find({
            where:{
                approuveProvider: false,
                rectoCniProvider: {neq:""},
                versoCniProvider: {neq:""}
            },
            include:[
                {
                    relation:'hebergements'
                }
            ]
            
        }, (err, provider) =>{
            console.log(provider)
            if(err) cb(err, null)
            else
                cb(null, provider);
        })
    }


    Provider.remoteMethod('afficheDemandeApprouve',
    {
        http:{ path: '/afficheDemandeApprouve',verb:'get'},
        returns : { type: 'object', root: true } 
    });




    Provider.afficheActiver = function (cb) {
        
        Provider.find({
            where:{
                approuveProvider: true,
                activeProvider: true
            },
            include:[
                {
                    relation:'hebergements'
                }
            ]
            
        }, (err, provider) =>{
            console.log(provider)
            if(err) cb(err, null)
            else
                cb(null, provider);
        })
    }


    Provider.remoteMethod('afficheActiver',
    {
        http:{ path: '/afficheActiver',verb:'get'},
        returns : { type: 'object', root: true } 
    });




    Provider.afficheDesactiver = function (cb) {
        
        Provider.find({
            where:{
                approuveProvider: true,
                activeProvider: false
            },
            include:[
                {
                    relation:'hebergements'
                }
            ]
            
        }, (err, provider) =>{
            console.log(provider)
            if(err) cb(err, null)
            else
                cb(null, provider);
        })
    }


    Provider.remoteMethod('afficheDesactiver',
    {
        http:{ path: '/afficheDesactiver',verb:'get'},
        returns : { type: 'object', root: true } 
    });




    Provider.approve = function (id, cb) {

        const messageServeur = Reservation.app.models.messageServeur;

        function sendMessageServeur(msg ="Félicitation votre compte fournisseur a été approuvé !" , obj ="Ajout fournisseur") {
            messageServeur.create( {
                message: msg,
                objetMessage: obj,
                vueMessage: false,
                providerId: id,
              }
            ,(err, mess)=>{
    
            });
        }

        Provider.findById(
            id,
            (err, provider) =>{
                console.log(provider)
                
                provider.updateAttributes({
                    approuveProvider: true,
                    activeProvider: true,
                    approval_datetime: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else{
                        sendMessageServeur("Félicitation votre compte fournisseur a été approuvé !")

                        cb(null, provider)
                    }
                    
                });

                notify.sendPushNotification(
                    provider.device_fcm_token,
                    "Fournisseur approuvé",
                    "Votre compte fournisseur à été approuvé",
                    "PRO"
                    );
            });
    }
    
    
    Provider.remoteMethod('approve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    Provider.approuve = function (id, cb) {
        Provider.findById(
            id,
            (err, provider) =>{
                console.log(provider)
                provider.updateAttributes({
                    approval_datetime: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, provider)
                })
            })
    }
    
    
    Provider.remoteMethod('approuve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approuve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



    Provider.active = function (id, cb) {
        Provider.findById(
            id,
            (err, provider) =>{
                provider.updateAttributes({
                    activeProvider: true,
                    active_datetime: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, provider)
                })
            })
    }
    
    
    Provider.remoteMethod('active',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/active', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
