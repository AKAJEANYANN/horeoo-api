'use strict';

module.exports = function(Equipementhashebergement) {

    Equipementhashebergement.createequipment = function (req ,cb) {
        
        const Equipement = req.body.equipement;
        const Hebergement = req.body.hebergement;

        var infoequip = Equipementhashebergement.app.models.infoequip;

        

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
