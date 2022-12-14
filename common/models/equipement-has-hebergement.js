'use strict';

const equipement = require("./equipement");

module.exports = function(Equipementhashebergement) {

    // creation d'equipement pour un hebergement
    Equipementhashebergement.createequipment = function (req, idhebergement, cb) {

        const idArrayEquipement = req.body.idArrayEquipement.split(",");
        // console.log(idArrayEquipement);

        function mycreation(params) {
            Equipementhashebergement.create({
                equipementId: params,
                hebergementId: idhebergement,
            });
        }

        var filter = {
            where: {
                hebergementId:idhebergement
            }
         };

        Equipementhashebergement.destroyAll(
            filter.where,
            (err, equip) =>{
            // console.log(equip)
            if(err) cb (err, null)
            else {
            // cb(null, equip);
            idArrayEquipement.forEach(idItem => {
                mycreation(idItem);

            },(err, arrayEquipement) =>{
                console.log(arrayEquipement);
                if(err) cb (err, null)
                // else 
                    // cb(null, arrayEquipement);
                    
            });

            Equipementhashebergement.find(
                {
                    where: {
                        hebergementId:idhebergement
                    }
                 },(err,equipement)=>{
                if(err)cb(err, null)
                else
                    cb(null, equipement)
            })
            
        }

        })

    }
    
    
    
    Equipementhashebergement.remoteMethod('createequipment',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'idhebergement', type:'string', required: true}
        ],
        http: { path: '/:idhebergement/createequipment', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
