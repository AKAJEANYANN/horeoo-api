'use strict';

module.exports = function(Hebergementhascustomer) {
    Hebergementhascustomer.liked = function (customerId, cb) {

        const Offre = Hebergementhascustomer.app.models.offre;

        Hebergementhascustomer.find({
            where:{
                customerId: customerId
            },
            include:{
                relation:'hebergement'
            }
            
        },(err, heberhascustom) =>{
            console.log(heberhascustom);
            if(err) cb(err, null)
            else{
                Offre.find({
                    where:{
                        hebergementId: heberhascustom.hebergementId
                    },
                    limit:1
                },(err, offre) =>{
                    console.log([heberhascustom, offre]);
                    if(err) cb(err, null)
                    else cb(null, [heberhascustom, offre])
                })
            }
        })
    }


    Hebergementhascustomer.remoteMethod('liked', {
        accepts: {arg: 'customerId', type: 'string'},
        http:{ path: '/liked',verb:'get'},
        returns: {type: 'object', root: true}
  });



};
