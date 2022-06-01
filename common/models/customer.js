'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Customer) {
    
    // creation du compte client
    Customer.phonenumber = function (req ,cb) {

        var phoneCustomer = req.body.phoneCustomer;
        var code = req.body.code;
    
        if(phoneCustomer != null && phoneCustomer != undefined && phoneCustomer != ""){
    
        Customer.findOne({
            where: {
                phoneCustomer: phoneCustomer,
            }
        }, (err, customer) => {
    
            console.log(customer);
    
            // cas 1 l'utilisateur existe: 
            if(customer){
                    // 2 mettre a jour le MDP avec le code de 5 chiffre
                    customer.updateAttributes({
                        email : phoneCustomer + '@horeoo.ci',
                        password : `${code}`
                    },(err, customer) => {
                        console.log(customer);
    
                    // Retourner une reponse
                    if(err) cb(err, null)
                    else 
                    cb(null, customer);
    
                })
                // })
                
            }
            // cas 2 l'utilsiateur n'existe pas
            else {
                // 2 creer l'utilisateur avec son numero de tel 
    
                Customer.create(
                    {
                        username: phoneCustomer,
                        phoneCustomer: phoneCustomer,
                        email : phoneCustomer + '@horeoo.ci',
                        password : `${code}`,
                    },
                    (err, Customer) => {
                        console.log(Customer)
                        
                        // Retourner une reponse
                        if(err) cb(err, null);
                        else cb(null, Customer);
                                           
                    }
                )
               
            }
        })
    }
    else{
        cb(null, "Veuillez entrer le numéro de téléphone")
    } 
    
    };  
    
    Customer.remoteMethod('phonenumber',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/phonenumber', verb: 'post'},
        returns : { type: 'object', root: true } 
    });


    // creation de compte par sms
    Customer.number = function (req ,cb) {

        const message = "Votre code de connexion est : " ;
        var msisdn = req.body.msisdn;

        var code = Math.floor(Math.random() * 9000) + 1000;
        var code = (msisdn != null && msisdn != undefined && msisdn != "+2250748443404" && msisdn != "+2250544727272" && msisdn != "+2250709128585" && msisdn != "0707334770" ) ?  Math.floor(Math.random() * 9000) + 1000 : 1111;


        if(msisdn != null && msisdn != undefined && msisdn != ""){

            Customer.findOne({
                where: {
                    username : msisdn,
                    phoneCustomer: msisdn,
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
                    Customer.create(
                        {
                            username : msisdn,
                            phoneCustomer: msisdn,
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

    Customer.remoteMethod('number',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/number', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



   

   

};