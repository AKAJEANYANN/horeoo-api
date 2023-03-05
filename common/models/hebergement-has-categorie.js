'use strict';

module.exports = function(Hebergementhascategorie) {

    // recherchd d'hébergement
    Hebergementhascategorie.vedette = function (categorieId, limit, skip, typeHebergement, cb) {
    
    
    
          Hebergementhascategorie.find({
            where:{
                categorieId: categorieId,
                // dateExpiration : {
                //     gt: Date.now()
                // }
            },
            include:{
                relation:'hebergement',
                scope:{
                    limit: limit,
                    skip: skip,
                    where:{
                        approuveHebergement: true,
                        onlineHebergement: true,
                        typeHebergement: typeHebergement
                        },
                        include:
                            {
                            relation:'offres',
                            scope:{
                            where:{
                                actifOffre: true,
                            },
                            limit:1
                            }
                        }
                    }
                }
    
            },(err, hebergement) =>{
            if (err) cb(err, null)
            else{
                // const hebergements = hebergement.filter(e => e.hebergement.offres.length > 0);
                cb(null, hebergement);

             }
            },
        )
    }
    
    Hebergementhascategorie.remoteMethod('vedette', {
        accepts: [
                {arg: 'categorieId', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'typeHebergement', type: 'string', required: true}
            ],
        http:{ path: '/:categorieId/vedette',verb:'get'},
        returns: {type: 'object', root: true}
    });







    // Hebergementhascategorie.remoteMethod('ajoutVedette', {
    //     accepts: [
    //             {arg: 'idHebergementhascategorie', type: 'string', required: true},
    //             {arg: 'limit', type: 'string'},
    //             {arg: 'skip', type: 'string'},
    //             {arg: 'typeHebergement', type: 'string', required: true}
    //         ],
    //     http:{ path: '/ajoutVedette',verb:'get'},
    //     returns: {type: 'object', root: true}
    // });

};
