'use strict';

const hebergement = require("./hebergement");

module.exports = function(Hebergementhascustomer) {
    Hebergementhascustomer.liked = function (customerId, cb) {

        const Hebergement = Hebergementhascustomer.app.models.hebergement;
        var listHebe = [];
        // if(Hebergementhascustomer.customerId == customerId){
        
        Hebergementhascustomer.find({
            where:{
                customerId: customerId
            }
            
        },(err, heberhascustom) =>{
            if(err) cb(err, null);
            
            else{
                   
                   heberhascustom.forEach(element => {
                       Hebergement.findById(element.hebergementId ,{
                           include:{
                               relation: 'offre',
                           scope:{limit: 1}
                       }
                       } , (err, heber) =>{
                        console.log(heber);
                        if(err) cb(err, null)
                        else{
                            listHebe.push(heber)
                            cb(null, listHebe)
                        }
                       })      
                   })                   

                }

        })
    // }
    // // else{
    // //     cb(null, "L'utilisateur n'a pas liké un hebergement")
    // // } 

    }


    Hebergementhascustomer.remoteMethod('liked', {
        accepts: {arg: 'customerId', type: 'string'},
        http:{ path: '/liked',verb:'get'},
        returns: {type: 'object', root: true}
  });




  Hebergementhascustomer.aime = function (customerId, cb) {

    const Hebergement = Hebergementhascustomer.app.models.hebergement;
    var listHebe = [];
    // if(Hebergementhascustomer.customerId == customerId){
    
    Hebergementhascustomer.find({
        where:{
            customerId: customerId
        }
        
    },(err, heberhascustom) =>{
        console.log(heberhascustom);
        if(heberhascustom != ""){
            Hebergement.find(
                {
                    where:{
                        id: heberhascustom.hebergementId
                    },
                    include:{
                        relation: 'offre',
                    scope:{limit: 1}
                }
                }, (err, heber) =>{
                    console.log(heber);
                    if(err) cb(err, null)
                    else
                        cb(null, heber)
                   })
        }
        else{
            cb(null, "pas de like")
        }


    })
// }
// // else{
// //     cb(null, "L'utilisateur n'a pas liké un hebergement")
// // } 

}


Hebergementhascustomer.remoteMethod('aime', {
    accepts: {arg: 'customerId', type: 'string'},
    http:{ path: '/aime',verb:'get'},
    returns: {type: 'object', root: true}
});

};
