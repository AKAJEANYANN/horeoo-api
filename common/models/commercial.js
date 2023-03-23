'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Commercial) {


    // creation d'un commercial avec generation de code commercial
    
    
    Commercial.creation = function (req ,cb) {
    
        var codeCom = Math.floor(Math.random() * 90000) + 10000;

        const message = "Votre code de connexion est : " ;

        var msisdn = req.body.numero;        


        if(msisdn != null && msisdn != undefined && msisdn != ""){

            Commercial.findOne({
                where: {
                    numero: msisdn,
                }
            }, (err, commercial) => {

                // cas 1 l'utilisateur existe: 
                if(commercial){
                    
                    // mettre a jour le MDP avec le code de 5 chiffre
                    commercial.updateAttributes({
                        email : msisdn + '@horeoo.com',
                        password : `${code}`
                    },(err, comme) => {
                        console.log(comme);
                        if(err) cb(err, null)
                        else {

                            // TODO : Envoyer SMS
                            notify.sendSMS(message + code, msisdn);
                            
                            // Retourner une reponse
                            cb(null, [message + code, comme]);
                        }


                        })            
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Commercial.create(
                        {
                            numero: msisdn,
                            email : msisdn + '@horeoo.ci',
                            password : `${code}`,
                        },
                        (err, commerc) => {
                            if(err) cb(err, null);

                            else { 
                                // TODO : Envoyer SMS
                                notify.sendSMS(message + code, msisdn); 
                                // Retourner une reponse
                                cb(null, [message + code, commerc]); 
                                
                                
                            }

                        });
                }
            })
        }
        else{
            cb({status: 401, message: "Veuillez entrer le numéro de téléphone"}, null)
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




    // affiche commercial actif
    Commercial.afficheComActif = function (cb) {
        
        Commercial.find({
            where:{
                actif: true
            },
            include:{
                relation:'providers',
                scope:{
                    include:{
                        relation:'hebergements'
                    }
                }
            }
        },
            (err, commercial) =>{
                if(err) cb(err, null)
                else
                    cb(null, commercial)

            })
    }
    
    
    Commercial.remoteMethod('afficheComActif',
    {
        http: { path: '/afficheComActif', verb: 'get'},
        returns : { type: 'object', root: true } 
    });




    // affiche commercial desactif
    Commercial.afficheComDesactif = function (cb) {
        
        Commercial.find({
            where:{
                actif: false
            },
            include:{
                relation:'providers',
                scope:{
                    include:{
                        relation:'hebergements'
                    }
                }
            }
        },
            (err, commercial) =>{
                if(err) cb(err, null)
                else
                    cb(null, commercial)

            })
    }
    
    
    Commercial.remoteMethod('afficheComDesactif',
    {
        http: { path: '/afficheComDesactif', verb: 'get'},
        returns : { type: 'object', root: true } 
    });






    // activer un commercial
    Commercial.activer = function (id, cb) {
        

        Commercial.findById(id,
            (err, commercial) =>{

                commercial.updateAttributes({
                    actif: true
                },(err, com)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, com)
                })

            })
    }
    
    
    Commercial.remoteMethod('activer',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/activer', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    
    // desactiver un commercial
    Commercial.desactiver = function (id, cb) {
        

        Commercial.findById(id,
            (err, commercial) =>{
                console.log(commercial);
                commercial.updateAttributes({
                    actif: false
                },(err, com)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, com)
                })

            })
    }
    
    
    Commercial.remoteMethod('desactiver',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/desactiver', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    

};
