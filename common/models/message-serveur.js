'use strict';

module.exports = function(Messageserveur) {

    // envoie message a un provider avec suppresion du contenu du champ approuve
    // Messageserveur.postMessage= function (req, cb) {
        
    //     var Objet= req.body.objet;
    //     var Message= req.body.message;
    //     var Idpro= req.body.idpro;
        
    //     Messageserveur.create({
    //         objetMessage: Objet,
    //         message: Message,
    //         providerId: Idpro

    //     },(err, message) =>{
    //         if(err) cb(err, null);
    //         else cb(null, message);
    //     })
        
    // }



    // Provider.remoteMethod('postMessage',
    // {
    //     accepts: [
    //         { arg: 'req', type: 'object', 'http': {source: 'req'}},
    //     ],
    //     http: { path: '/postMessage', verb: 'post'},
    //     returns : { type: 'object', root: true } 
    // });

};
