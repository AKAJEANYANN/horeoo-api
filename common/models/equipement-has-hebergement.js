'use strict';

const equipement = require("./equipement");

module.exports = function(Equipementhashebergement) {

    Equipementhashebergement.createequipment = function (req ,cb) {
        
        const Equipement = req.body.equipement;
        const Hebergement = req.body.hebergement;

        var infoequip = Equipementhashebergement.app.models.infoequip;

        Equipement.findOne({
            where:{
                id: infoequip.id
            }
        },(err, equipement) =>{
            console.log(equipement);

            Equipement.destroyAll();
            console.log(Equipement);

            Equipement.create(infoequip)
            console.log(Equipement);

        })

    }
    
    
    
    Provider.remoteMethod('createequipment',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/createequipment', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
