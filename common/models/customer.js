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
                phoneCustomer: phoneCustomer
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
        var numdemo = "+2250011223344";
        // const arrayNum =["+2250011223344","+2250709128585","+2250748443404","+2250141812443"];
        // var result = false;
        // result = verifynum();
        // var code = Math.floor(Math.random() * 9000) + 1000;
        var code = (msisdn != null && msisdn != undefined && msisdn != numdemo && msisdn != "+2250709128585") ?  Math.floor(Math.random() * 9000) + 1000 : 1111;
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
                        else if(msisdn != "+2250709128585") {
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
                    Customer.create(
                        {
                            username : msisdn,
                            phoneCustomer: msisdn,
                            email : msisdn + '@horeoo.ci',
                            password : `${code}`,
                        },
                        (err, user) => {
                            if(err) cb(err, null);

                            else if(msisdn !=numdemo && msisdn !="+2250709128585") { 
                                // Retourner une reponse
                                cb(null, [message + code, user]);
                                // TODO : Envoyer SMS
                                 notify.sendSMS(msisdn, message + code);   
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

    Customer.remoteMethod('number',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/number', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

   
// activation des customer
    Customer.active = function (id, cb) {
        Customer.findById(
            id,
            (err, customer) =>{
                customer.updateAttributes({
                    activeCustomer: true,
                    active_datetime: Date.now()
                },(err, customer) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, customer)
                });

                notify.sendPushNotification(
                    customer.device_fcm_token,
                    "Compte activé",
                    "Votre compte client a été activé",
                    "CUS"
                    );
            })
    }
    
    
    Customer.remoteMethod('active',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/active', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



    // desactivation des customers
    Customer.desactive = function (id, cb) {
        Customer.findById(
            id,
            (err, customer) =>{
                customer.updateAttributes({
                    activeCustomer: false,
                    active_datetime: Date.now()
                },(err, customer) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, customer)
                });

                notify.sendPushNotification(
                    customer.device_fcm_token,
                    "Compte désactivé",
                    "Votre compte client a été désactivé",
                    "CUS"
                    );
            })
    }
    
    
    Customer.remoteMethod('desactive',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/desactive', verb: 'post'},
        returns : { type: 'object', root: true } 
    });


    //affichage des reservation des client
    Customer.getClientReserv = function (cb) {
        
        Customer.find({
            include:[
                {
                    relation: 'reservations',
                    scope: {
                        include:{
                            relation: 'offre',
                            scope: {
                                include: 'hebergement'
                            }
                        }
                    }
                }
            ]
        }, (err, reservation) =>{
            console.log(reservation)
            if(err) cb(err, null)
            else
                cb(null, reservation);
        })
    }


    Customer.remoteMethod('getClientReserv',
    {
        http:{ path: '/getClientReserv',verb:'get'},
        returns : { type: 'object', root: true } 
    });






    //affichage des reservation des client actif
    Customer.getClientActifReserv = function (cb) {
        
        Customer.find({
            where:{
                activeCustomer: true
            },
            include:[
                {
                    relation: 'reservations',
                    scope: {
                        include:{
                            relation: 'offre',
                            scope: {
                                include: 'hebergement'
                            }
                        }
                    }
                }
            ]
        }, (err, reservation) =>{
            console.log(reservation)
            if(err) cb(err, null)
            else
                cb(null, reservation);
        })
    }


    Customer.remoteMethod('getClientActifReserv',
    {
        http:{ path: '/getClientActifReserv',verb:'get'},
        returns : { type: 'object', root: true } 
    });





    //affichage des reservation des client desactif
    Customer.getClientDesactifReserv = function (cb) {
        
        Customer.find({
            where:{
                activeCustomer: false
            },
            include:[
                {
                    relation: 'reservations',
                    scope: {
                        include:{
                            relation: 'offre',
                            scope: {
                                include: 'hebergement'
                            }
                        }
                    }
                }
            ]
        }, (err, reservation) =>{
            console.log(reservation)
            if(err) cb(err, null)
            else
                cb(null, reservation);
        })
    }


    Customer.remoteMethod('getClientDesactifReserv',
    {
        http:{ path: '/getClientDesactifReserv',verb:'get'},
        returns : { type: 'object', root: true } 
    });




};