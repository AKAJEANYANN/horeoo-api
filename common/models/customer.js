'use strict';

module.exports = function(Customer) {
    
    // creation de compte
    Customer.phonenumber = function (req ,cb) {

        var phoneCustomer = req.body.phoneCustomer;
        var code =  req.body.code;
    
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
                        phoneCustomer: phoneCustomer,
                        email : phoneCustomer + '@moya.ci',
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
        cb("Veuillez entrer le numéro de téléphone", null)
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
};
