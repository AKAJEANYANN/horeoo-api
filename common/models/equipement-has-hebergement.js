'use strict';

const equipement = require("./equipement");

module.exports = function(Equipementhashebergement) {

    Equipementhashebergement.createequipment = function (req, id, cb) {
        
        const Equipement = Equipementhashebergement.app.models.equipement;
        const Hebergement =Equipementhashebergement.app.models.hebergement;

        var infoequip = req.body.infoequip;

        Equipement.findOne({
            where:{
                id: id
            }
        },(err, equipement) =>{
            console.log(equipement);

            // Equipement.destroyAll();
            // console.log(Equipement);

            // Equipement.create(infoequip)
            // console.log(Equipement);

        })

    }
    
    
    
    Equipementhashebergement.remoteMethod('createequipment',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'id', type:'string', required: true}
        ],
        http: { path: '/:id/createequipment', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
