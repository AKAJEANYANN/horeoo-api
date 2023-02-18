'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Provider) {

    //connexion customer
    Provider.number = function (req ,cb) {

        const message = "Votre code de connexion est: " ;

        var msisdn = req.body.numero;
        var numdemo = "+2250011223344";
        var numexterieur = "+2250123456789";

        var code = (msisdn != null || msisdn != undefined || msisdn != numdemo || msisdn != "+2250709128585" || msisdn != "+2250748443404" || msisdn != numexterieur) ?  Math.floor(Math.random() * 90000) + 10000 : 11111;
       

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
                        else if(msisdn != "+2250709128585" || msisdn != numdemo || msisdn != "+2250748443404") {
                            // TODO : Envoyer SMS
                            notify.sendSMS(msisdn, message + code);
                            
                            // Retourner une reponse
                            cb(null, [message + code, use]);
                        }
                        else {// Retourner une reponse
                            cb(null, [message + code, use]);}
                    })            
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Provider.create(
                        {
                            username : msisdn,
                            numero: msisdn,
                            email : msisdn + '@horeoo.com',
                            password : `${code}`,
                        },
                        (err, user) => {
                            if(err) cb(err, null);

                            else if(msisdn != numdemo || msisdn != "+2250748443404" || msisdn != numexterieur) { 
                                // TODO : Envoyer SMS
                                notify.sendSMS(msisdn, message + code);

                                // Retourner une reponse
                                cb(null, [message + code, user]);
                                   
                                }
                                else {// Retourner une reponse
                                    cb(null, [message + code, user]);}
                                               
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




    //suppression compte Provider
    Provider.delete = function (id, username, email, cb){
        
        Provider.findById(id,
            (err, provider)=>{
            console.log(provider);

            if(provider){
                provider.updateAttributes({
                    username: username + "_dell" + Date(),
                    email: "dell_" + email
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

};
