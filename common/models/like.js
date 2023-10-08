'use strict';

const hebergement = require("./hebergement");

module.exports = function(Like) {

    Like.affiche =function (customerId, cb) {

        Like.find({
            where:{
                customerId: customerId 
            },
            include:[
                {
                    relation:'customer',
                    relation:'hebergement',
                    
                }
                ]
        },(err, heberge)=>{
            if(err) cb(err, null)
            else
                cb(null, heberge);
        })
        
    }


    Like.remoteMethod('affiche', {
        accepts: 
            {arg: 'customerId', type: 'string'},
        http:{ path: '/hebergement/customer',verb:'get'},
        returns: {type: 'object', root: true}
    });

};
