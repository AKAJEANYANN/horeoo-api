'use strict';

const hebergement = require("./hebergement");

module.exports = function(Hebergementhascustomer) {
    Hebergementhascustomer.liked = function (customerId, cb) {

        const Hebergement = Hebergementhascustomer.app.models.hebergement;
       var tb = heberhascustom;
       
        // if(Hebergementhascustomer.customerId == customerId){
        if(tb == [])
        {
        Hebergementhascustomer.find({
            where:{
                customerId: customerId
            }
            
        },(err, heberhascustom) =>{
            if(err) cb(err, null)
            else{
                   var listHebe = [];
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
    }
    else{
        cb(null, "L'utilisateur n'a pas liké un hebergement")
    } 

    }


    Hebergementhascustomer.remoteMethod('liked', {
        accepts: {arg: 'customerId', type: 'string'},
        http:{ path: '/liked',verb:'get'},
        returns: {type: 'object', root: true}
  });



};
