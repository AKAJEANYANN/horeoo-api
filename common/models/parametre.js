'use strict';

module.exports = function(Parametre) {

    Parametre.facturation = function (valeur, cb) {

        Parametre.findOne({
            where:{
                codeParam: "facturationHebergement"
            }
        },(err, facturation)=>{
            console.log(facturation);

            facturation.updateAttributes({
                valeurParam: valeur,
                designationParam: "Facturation pour chaque client envoyé"
            },(err, facture)=>{
                console.log(facture);
                if(err) cb(err, null)
                else
                    cb(null, facture)
            })
        })

    }
    
    
    Parametre.remoteMethod('facturation',
    {
        accepts:{ arg: 'valeur', type: 'string'},
        http: { path: '/facturation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
