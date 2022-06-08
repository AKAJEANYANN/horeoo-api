'use strict';

module.exports = function(Hebergement) {

    // afficher un certain nombre d'hebergement avec typeHebergement
    Hebergement.random = function (limit, idTypeHebergement, cb) {
        // var ds = Hebergement.dataSource;
        // var sql = `SELECT * FROM hebergement ORDER BY RAND() LIMIT ${limit}`;

        // ds.connector.query(sql, function (err, data){
        //     if(err) throw err

        //     cb(null, data);
        // });
        Hebergement.find({
            limit: limit,
            include:{
                relation: "offre",
                scope:{
                    limit:1,
                    where:{
                        activeOffre: true
                    }
                }
            },
            where:{
                typeHebergementId: idTypeHebergement
            }
        },(err, hebergement) =>{
            if(err) cb(err, null)
            else cb(null, hebergement)
        })
    }


    Hebergement.remoteMethod('random', {
        accepts: [{arg: 'limit', type: 'string'},
        {arg: 'idTypeHebergement', type: 'string'}],
        http:{ path: '/random',verb:'get'},
        returns: {type: 'object', root: true}
  });




  Hebergement.liked = function (customerId, cb) {
        
    const Hebergementhascustomer = Hebergement.app.models.hebergementhascustomer;

    Hebergement.find({
        where:{
            customerId: customerId
        }
    })
}

  Hebergement.remoteMethod('liked', {
    accepts: {arg: 'customerId', type: 'string'},
    http:{ path: '/liked',verb:'get'},
    returns: {type: 'object', root: true}
});
  



Hebergement.approve = function (id, cb) {
    Hebergement.findById(
        id,
        (err, hebergement) =>{
            console.log(hebergement)
            hebergement.updateAttributes({
                approuveHebergement: true,
                approval_datetime: Date.now()
            },(err, heberge) =>{
                if(err) cb(err, null)
                else
                cb(null, heberge)
            })
        })
}


Hebergement.remoteMethod('approve',
{
    accepts: { arg: 'id', type: 'string' },
    http: { path: '/:id/approve', verb: 'post'},
    returns : { type: 'object', root: true } 
});




Hebergement.search = function (limit, skip, typeHebergementId, locationHebergement, cb) {
    
    Hebergement.find({
        limit: limit,
        skip: skip,
        where:{
            typeHebergementId: typeHebergementId,
            locationHebergement: locationHebergement
        },
        include:{
            relation:'offre',
            scope:{limit:1}
        }

    },(err, hebergement) =>{
        if(err) cb(err, null)
        else
            cb(null, hebergement)
    })
}

Hebergement.remoteMethod('search', {
    accepts: [
            {arg: 'limit', type: 'string'},
            {arg: 'skip', type: 'string'},
            {arg: 'typeHebergementId', type: 'string'},
            {arg: 'locationHebergement', type: 'string'}
        ],
    http:{ path: '/search',verb:'get'},
    returns: {type: 'object', root: true}
});


};
