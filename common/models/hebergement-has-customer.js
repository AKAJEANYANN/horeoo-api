'use strict';

const hebergement = require("./hebergement");

module.exports = function(Hebergementhascustomer) {


  Hebergementhascustomer.liked = function (customerId, typeHebergementId,  cb) {

    
    Hebergementhascustomer.find({
        where:{
            customerId: customerId
        },
        include:{
            relation: 'hebergement',
            scope:{
                where:{
                    typeHebergementId:typeHebergementId
                },
                include:{ 
                    relation: 'offre',
                    scope:{
                        limit: 1,
                        where:{
                            activeOffre: true
                        }
                    }
                }
            }
        }
        
    },(err, heberhascustom) =>{
      console.log(heberhascustom)
      if(err) cb(err, null)
      else cb(null, heberhascustom)
    }) 

}


Hebergementhascustomer.remoteMethod('liked', {
    accepts: [{arg: 'customerId', type: 'string'},
            {arg: 'typeHebergementId', type: 'string'}],
    http:{ path: '/liked',verb:'get'},
    returns: {type: 'object', root: true}
});





  Hebergementhascustomer.getClientReservation = function (cb) {

    
    Hebergementhascustomer.find({
       
        include:[{
            relation: 'customer',
            relation: 'hebergement',
            scope:{
                include:{ 
                    relation: 'offre'
                }
            }
        }]
        
    },(err, heberhascustom) =>{
      console.log(heberhascustom)
      if(err) cb(err, null)
      else cb(null, heberhascustom)
    }) 

}


Hebergementhascustomer.remoteMethod('getClientReservation', {
    
    http:{ path: '/getClientReservation',verb:'get'},
    returns: {type: 'object', root: true}
});

};
