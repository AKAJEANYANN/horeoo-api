'use strict';

module.exports = function(Categorie) {
    Categorie.heberByCat = function (categorieId, limit, skip, typeHebergement, cb) {
       
        Categorie.find({
            where:{
                id: categorieId
            },
            include:{
                
            }
        })
    }
};
