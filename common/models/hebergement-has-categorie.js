'use strict';

module.exports = function(Hebergementhascategorie) {

    // recherchd d'hébergement

    Hebergementhascategorie.heberCate = function (limit, skip, categorieId, typeHebergement, cb) {

        Hebergementhascategorie.find({
            limit: limit,
            skip: skip,
            where:{
                categorieId: categorieId,
            },
            include:[
                {
                    relation:'hebergement',
                    scope:{
                        where:{
                            // approuveHebergement: true,
                            // onlineHebergement: true,
                            typeHebergement: typeHebergement
                        },
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
                ],
        },
            (err, hebergeCate)=>{
                console.log(hebergeCate);
                if(err)cb(err, null)
                else
                    cb(null, hebergeCate);
            }
        )
        
    }



    Hebergementhascategorie.remoteMethod('heberCate', {
        accepts: [
                 {arg: 'limit', type: 'string'},
                 {arg: 'skip', type: 'string'},
                 {arg: 'categorieId', type: 'string'},
                 {arg: 'typeHebergement', type: 'string'}
             ],
        http:{ path: '/heberCate',verb:'get'},
        returns: {type: 'object', root: true}
    });






    // ajout hebergement en vedette
    Hebergementhascategorie.ajoutVedette = function (req, cb) {

        var hebergementId = req.body.hebergementId;


            Hebergementhascategorie.find({
                where:{
                    hebergementId: hebergementId
                }
                },(err, hebergevedette)=>{
                    console.log(hebergevedette);
    
    
                    if(hebergevedette.length == 0){
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
                    else
                        cb(null, "Hébergement déjà en vedette");
                })
        
    }

    Hebergementhascategorie.remoteMethod('ajoutVedette', {
        accepts:{ arg: 'req', type: 'object', 'http': {source: 'req'}},
        http:{ path: '/ajoutVedette',verb:'post'},
        returns: {type: 'object', root: true}
    });

};
