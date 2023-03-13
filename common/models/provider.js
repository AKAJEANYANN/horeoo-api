'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Provider) {

    //connexion Provider
    Provider.number = function (req ,cb) {

        const message = "Votre code de connexion est : " ;

        var msisdn = req.body.numero;
        var numdemo = "+2250011223344";
        var numgeraud = "+2250112345678";
        var numyatma = "+2250123456789";
        var numyannick = "+2250709128585";
        // const arrayNum =["+2250011223344","+2250709128585","+2250748443404","+2250141812443"];
        // var result = false;
        // result = verifynum();
        // var code = Math.floor(Math.random() * 9000) + 1000;
        var code = (msisdn != numdemo && msisdn != numgeraud && msisdn != numyatma && msisdn != numyannick) ?  Math.floor(Math.random() * 90000) + 10000 : 11111;
        // var code = result?  Math.floor(Math.random() * 9000) + 1000 : 1111;

        
        // function verifynum() {
            
        //     for (let index = 0; index < arrayNum.length; index++) {
        //         if(msisdn == array[index]){
        //             return false
        //         }
        //     }
        //     return true
        // };


        if(msisdn != null && msisdn != undefined && msisdn != ""){

            Provider.findOne({
                where: {
                    username : msisdn,
                    numero: msisdn,
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
                        else if(msisdn != numdemo && msisdn != numgeraud && msisdn != numyatma && msisdn != numyannick) {
                            // TODO : Envoyer SMS
                            notify.sendSMS(msisdn, message + code);
                            
                            // Retourner une reponse
                            cb(null, [message + code, use]);

                        }
                        else {// Retourner une reponse
                            cb(null, [message + code, use])};
                    // notification au provider
                    // notify.sendPushNotification(
                    //     use.device_fcm_token,
                    //     "Compte connecté",
                    //     "Vous êtes connecté",
                    //     "CUS"
                    //     );
                    })            
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Provider.create(
                        {
                            username : msisdn,
                            numero: msisdn,
                            email : msisdn + '@horeoo.ci',
                            password : `${code}`,
                        },
                        (err, user) => {
                            if(err) cb(err, null);

                            else if(msisdn != numdemo && msisdn != numgeraud && msisdn != numyatma && msisdn != numyannick) { 
                                // TODO : Envoyer SMS
                                notify.sendSMS(msisdn, message + code); 
                                // Retourner une reponse
                                cb(null, [message + code, user]); 
                                
                            }
                            else {// Retourner une reponse
                                cb(null, [message + code, user])};
                                
                        // notification au provider
                        // notify.sendPushNotification(
                        //     user.device_fcm_token,
                        //     "Compte crée",
                        //     "Votre compte a été crée avec succès",
                        //     "CUS"
                        //     );
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





    //suppression compte Provider obselete
    Provider.delete = function (id, username, email, cb){
        
        Provider.findById(id,
            (err, provider)=>{
            console.log(provider);

            if(provider){
                provider.updateAttributes({
                    approuve: "SUPPRESSION",
                    username: "dell_" + username + Date(),
                    email: "dell_" + email + Date(),
                    emailProvider: "dell_" + provider.emailProvider + Date(),
                },(err, provider)=>{
                    console.log(provider);
                    if(err)cb(err, null)
                    else {
                        cb(null, "succès");
                    }
                })
            }
            
        })
        
    };


    Provider.remoteMethod('delete',
    {
        accepts:[
            { arg: 'id', type:'string', required: true},
            { arg: 'username', type:'string', required: true},
            { arg: 'email', type:'string', required: true}
    ],
        http: { path: '/:id/delete', verb: 'delete'},
        returns : { type: 'object', root: true } 
    });




    //suppression compte Provider
    Provider.dell = function (id, cb){
        
        const Hebergement = Provider.app.models.hebergement;

        const time = Math.floor(Date.now() / 1000) ;


        Provider.findById(id,
            (err, provider)=>{

                Hebergement.find({
                    where:{
                        providerId: provider.id
                    }
                },(err, hebergements)=>{
                    console.log(hebergements);

                    hebergements.forEach(element => {

                        element.updateAttributes({

                            approuveHebergement: false,
                            actifHebergement: false,
                            dateDesactif: Date.now(),
                            onlineHebergement: false,
                            delete: true,
                            dateDelete: Date.now()

                        })
                    },(err, heberge)=>{

                    });
                })

                if(err)cb(err, null)
                else{

                    provider.updateAttributes({
                        approuve: "SUPPRESSION",
                        username: "dell_"+ time + provider.username,
                        email: "dell_"+ time + provider.email,
                        emailProvider: "dell_"+ time + provider.emailProvider ,
                    },(err, provider)=>{
                        console.log(provider);
                        
                        cb(err, provider);
                    })

                }

            
            
        })
        
    };


    Provider.remoteMethod('dell',
    {
        accepts:{ arg: 'id', type:'string', required: true},
        http: { path: '/:id/dell', verb: 'delete'},
        returns : { type: 'object', root: true } 
    });





     // affiche tous les provider sans suppression de compte
     Provider.affiche = function (cb) {
        
        Provider.find({
            where:{
                approuve: {neq:"SUPPRESSION"}
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


    Provider.remoteMethod('affiche',
    {
        http:{ path: '/affiche',verb:'get'},
        returns : { type: 'object', root: true } 
    });





    // affiche provider en attente d'approbation
    Provider.afficheDemandeApprouve = function (cb) {
        
        Provider.find({
            where:{
                approuve: "TRAITEMENT"
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






    // approbation de provider
    Provider.approuve = function (id, cb) {

        const messageServeur = Provider.app.models.messageServeur;

        function sendMessageServeur(msg ="Félicitation votre compte provider a été approuvé !" , obj ="Ajout fournisseur") {
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
                    approuve: "APPROUVE",
                    dateApprouve: Date.now(),
                    actif: true,
                    actifDate: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else{
                        sendMessageServeur("Félicitation votre compte provider a été approuvé !")

                        notify.sendPushNotification(
                            provider.device_fcm_token,
                            "Fournisseur approuvé",
                            "Votre compte fournisseur à été approuvé",
                            "PRO"
                            );
                        cb(null, provider)
                    };
                    
                });

            })
    }
    
    
    Provider.remoteMethod('approuve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approuve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    // activer provider
    Provider.activeProvider = function (id, cb) {

        const messageServeur = Provider.app.models.messageServeur;

        function sendMessageServeur(msg ="Votre compte fournisseur a été activé !" , obj ="Activation fournisseur") {
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
                provider.updateAttributes({
                    actif: true,
                    actifDate: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else{
                        sendMessageServeur("Votre compte fournisseur a été activé !")

                        notify.sendPushNotification(
                            provider.device_fcm_token,
                            "Fournisseur activé",
                            "Votre compte fournisseur à été activé",
                            "PRO"
                            );

                        cb(null, provider)
                    };
                });
            })
    }
    
    
    Provider.remoteMethod('activeProvider',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/activeProvider', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    // desactiver provider
    Provider.desactiveProvider = function (id, cb) {

        const messageServeur = Provider.app.models.messageServeur;

        function sendMessageServeur(msg ="Votre compte fournisseur a été désactivé pour non respect de nos règlements !" , obj ="Désactivation fournisseur") {
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
                provider.updateAttributes({
                    actif: false,
                    desactifDate: Date.now()
                },(err, provider) =>{
                    if(err) cb(err, null)
                    else{
                        sendMessageServeur("Votre compte fournisseur à été désactivé pour non respect de nos règlement !")

                        cb(null, provider)
                    }
                });
                notify.sendPushNotification(
                    provider.device_fcm_token,
                    "Fournisseur désactivé",
                    "Votre compte fournisseur à été désactivé pour non respect de nos règlement !",
                    "PRO"
                    );
            })
    }


    
    Provider.remoteMethod('desactiveProvider',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/desactiveProvider', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    // affichage du provider activer
    Provider.afficheProviderActif = function (cb) {
        
        Provider.find({
            where:{
                approuve: "APPROUVE",
                actif: true
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


    Provider.remoteMethod('afficheProviderActif',
    {
        http:{ path: '/afficheProviderActif',verb:'get'},
        returns : { type: 'object', root: true } 
    });


    // affichage du provider desactiver
    Provider.afficheProviderDesactif = function (cb) {
        
        Provider.find({
            where:{
                approuve: "APPROUVE",
                actif: false
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


    Provider.remoteMethod('afficheProviderDesactif',
    {
        http:{ path: '/afficheProviderDesactif',verb:'get'},
        returns : { type: 'object', root: true } 
    });

};
