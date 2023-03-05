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





    // ajout hebergement en vedette
    Hebergementhascategorie.ajoutVedette=function (req, cb) {

        var hebergementId = req.body.hebergementId;

        Hebergementhascategorie.find({
            where:{
                hebergementId: hebergementId
            }
            },(err, hebergevedette)=>{
                console.log(hebergevedette);

                if(hebergevedette.hebergementId != hebergementId){
                    Hebergementhascategorie.create({
                        // dateExpiration: "",
                        categorieId: "86bca5e9-1261-4f20-82a9-0f3afb00f454",
                        hebergementId: hebergementId
                    },(err, vedette)=>{
                        console.log(vedette);

                        if(err)cb(err, null)
                        else
                            cb(null, vedette);
                    })
                }
                else if(hebergevedette.hebergementId == hebergementId)
                    cb(null, "hebergement deja en vedette");
            })
        
    }

    Hebergementhascategorie.remoteMethod('ajoutVedette', {
        accepts:{ arg: 'req', type: 'object', 'http': {source: 'req'}},
        http:{ path: '/ajoutVedette',verb:'post'},
        returns: {type: 'object', root: true}
    });

};
