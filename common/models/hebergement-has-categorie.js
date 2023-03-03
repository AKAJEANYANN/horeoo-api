'use strict';

module.exports = function(Hebergementhascategorie) {

    // recherchd d'hébergement
    Hebergementhascategorie.vedette = function (idHebergementhascategorie, limit, skip, typeHebergement, cb) {
    
    
    
          Hebergementhascategorie.find({
            where:{
                id: idHebergementhascategorie
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
                {arg: 'idHebergementhascategorie', type: 'string'},
                {arg: 'limit', type: 'string'},
                {arg: 'skip', type: 'string'},
                {arg: 'typeHebergement', type: 'string'}
            ],
        http:{ path: '/vedette',verb:'get'},
        returns: {type: 'object', root: true}
    });

};
