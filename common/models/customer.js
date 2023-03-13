'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Customer) {

    Customer.number = function (req ,cb) {

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

            Customer.findOne({
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
                            notify.sendSMS(message + code, msisdn);
                            
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
                    Customer.create(
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
                                notify.sendSMS(message + code, msisdn); 
                                // Retourner une reponse
                                cb(null, [message + code, user]); 
                                
                                
                            }
                            else {// Retourner une reponse
                                cb(null, [message + code, user]);
                            }; 

                        // // notification au provider
                        // notify.sendPushNotification(
                        //     user.device_fcm_token,
                        //     "Compte crée",
                        //     "Votre compte a été crée avec succès",
                        //     "CUS"
                        //     );
                        });
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



    //suppression compte Provider
    Customer.delete = function (id, username, email, cb){
        
        Customer.findById(id,
            (err, customer)=>{
            console.log(customer);

            if(customer){
                customer.updateAttributes({
                    username: username + "_dell" + Date(),
                    email: "dell_" + email
                },(err, customer)=>{
                    console.log(customer);
                    if(err)cb(err, null)
                    else {
                        cb(null, "succès");
                    }
                })
            }
            
        })
        
    };

    Customer.remoteMethod('delete',
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
    Customer.dell = function (id, cb){
        
        const time =   Math.floor(Date.now() / 1000) ;


        Customer.findById(id,
            (err, customer)=>{
            console.log(customer);

            if(customer){
                customer.updateAttributes({
                    approuve: "SUPPRESSION",
                    username: "dell_"+ time + customer.username,
                    email: "dell_"+ time + customer.email,
                    emailCustomer: "dell_"+ time + customer.emailCustomer ,
                },(err, customer)=>{
                    console.log(customer);
                    if(err)cb(err, null)
                    else {
                        cb(null, "succès");
                    }
                })
            }
            
        })
        
    };


    Customer.remoteMethod('dell',
    {
        accepts:{ arg: 'id', type:'string', required: true},
        http: { path: '/:id/dell', verb: 'delete'},
        returns : { type: 'object', root: true } 
    });

};

