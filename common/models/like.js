'use strict';

module.exports = function(Like) {

    Like.affiche =function (customerId, cb) {

        Like.find({
            where:{
                customerId: customerId 
            },
            include:[
                {
                    relation:'hebergement',
                    scope:{
                        include:[
                            {
                                relation:'offres',
                                scope:{
                                    where:{
                                        actifOffre: true,
                                    },
                                    limit:1
                                }
                            }
                        ],
                    },
                    
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
