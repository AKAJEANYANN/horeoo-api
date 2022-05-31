'use strict';

const hebergement = require("./hebergement");

module.exports = function(Hebergementhascustomer) {
    Hebergementhascustomer.liked = function (customerId, cb) {

        const Offre = Hebergementhascustomer.app.models.offre;
        const Hebergement = Hebergementhascustomer.app.models.hebergement;

        Hebergementhascustomer.find({
            where:{
                customerId: customerId
            }
            
        },(err, heberhascustom) =>{
            console.log(heberhascustom);
            if(err) cb(err, null)
            else{
            //    if (heberhascustom ==[] ) {
            //        cb(heberhascustom)
            //    }else {
                   var listHebe = [];
                   heberhascustom.forEach(element => {
                    if(element.hebergementId ==customerId)
                    {
                       Hebergement.findById(element.hebergementId ,{
                           include:{
                               relation: 'offre',
                           scope:{limit: 1}
                       }
                       } , (err, heber) =>{
                        listHebe.push(heber)
                        console.log(heber)
                        if(err) cb(err, null)
                        else
                        cb(null, listHebe)
                       })
                    }  
                        

                   });
                   

            }
            // }

        })
    }


    Hebergementhascustomer.remoteMethod('liked', {
        accepts: {arg: 'customerId', type: 'string'},
        http:{ path: '/liked',verb:'get'},
        returns: {type: 'object', root: true}
  });



};
