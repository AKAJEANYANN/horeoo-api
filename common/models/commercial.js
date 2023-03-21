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
    Commercial.activer = function (req, cb) {
        
        var idCom = req.body.id;

        Commercial.findById(idCom,
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
        accepts:{ arg: 'req', type: 'object', 'http': {source: 'req'}},
        http: { path: '/activer', verb: 'post'},
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
