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



  Hebergement.affiche = function (cb) {
      
    Hebergement.find(
        {
            include:"offre"
        },
        (err, hebergement) =>{
            console.log(hebergement)
            if(err) cb(err, null)
            else cb(null, hebergement)
        }
    )
  }

  Hebergement.remoteMethod('affiche', {
    http:{ path: '/affiche',verb:'get'},
    returns: {type: 'object', root: true}
});


  

};
