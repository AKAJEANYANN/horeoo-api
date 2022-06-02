'use strict';

const hebergement = require("./hebergement");

module.exports = function(Hebergementhascustomer) {


  Hebergementhascustomer.liked = function (customerId, cb) {

    
    Hebergementhascustomer.find({
        where:{
            customerId: customerId
        },
        include:{
            relation: 'hebergement',
            scope:{
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
    accepts: {arg: 'customerId', type: 'string'},
    http:{ path: '/liked',verb:'get'},
    returns: {type: 'object', root: true}
});

};
