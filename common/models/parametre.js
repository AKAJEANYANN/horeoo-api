'use strict';

module.exports = function(Parametre) {

    // api de facturation pour chaque client envoyé
    Parametre.facturation = function (montant, cb) {

        // var montant = req.body.montant;

        Parametre.findOne({
            where:{
                codeParam: "facturationHebergement"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeurParam: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeurParam: montant,
                    codeParam: "facturationHebergement",
                    designationParam: "Montant prélevé pour chaque client envoyer",
                    dateModifParam: Date.now()
                },(err, fact)=>{
                    console.log(fact);
                    if(err)cb(err, null)
                    else
                        cb(null, fact);
                })
            }
            

        })

    }
    
    
    Parametre.remoteMethod('facturation',
    {
        accepts: { arg: 'montant', type: 'string' },
        http: { path: '/:montant/facturation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    //api de recharge minimum 
    Parametre.rechargeMinim = function (montant, cb) {

        // var montant = req.body.montant;

        Parametre.findOne({
            where:{
                codeParam: "minRecharge"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeurParam: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeurParam: montant,
                    codeParam: "minRecharge",
                    designationParam: "Montant minimum de rechargement",
                    dateModifParam: Date.now()
                },(err, fact)=>{
                    console.log(fact);
                    if(err)cb(err, null)
                    else
                        cb(null, fact);
                })
            }
            

        })

    }
    
    
    Parametre.remoteMethod('rechargeMinim',
    {
        accepts: { arg: 'montant', type: 'string' },
        http: { path: '/:montant/rechargeMinim', verb: 'post'},
        returns : { type: 'object', root: true } 
    });






    //api solde alerte
    Parametre.soldeAlerte = function (montant, cb) {

        // var montant = req.body.montant;

        Parametre.findOne({
            where:{
                codeParam: "soldeAlerte"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeurParam: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeurParam: montant,
                    codeParam: "soldeAlerte",
                    designationParam: "Montant à partir duquel un message vous sera envoyé",
                    dateModifParam: Date.now()
                },(err, fact)=>{
                    console.log(fact);
                    if(err)cb(err, null)
                    else
                        cb(null, fact);
                })
            }
            

        })

    }
    
    
    Parametre.remoteMethod('soldeAlerte',
    {
        accepts: { arg: 'montant', type: 'string' },
        http: { path: '/:montant/soldeAlerte', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    //api periode offre
    Parametre.periodeOffre = function (offre, cb) {


        Parametre.findOne({
            where:{
                codeParam: "periodeOffre"
            }
        },(err, periode)=>{
            console.log(periode);

            if(periode){

                periode.updateAttributes({
                    valeurParam: offre,
                    dateModifParam: Date.now()
                },(err, periode)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, periode);
    
                })
            }
            else {
                Parametre.create({
                    valeurParam: offre,
                    codeParam: "periodeOffre",
                    designationParam: "Periode des offres",
                    dateModifParam: Date.now()
                },(err, periode)=>{
                    console.log(periode);
                    if(err)cb(err, null)
                    else
                        cb(null, periode);
                })
            }
            

        })

    }
    
    
    Parametre.remoteMethod('periodeOffre',
    {
        accepts: { arg: 'offre', type: 'string' },
        http: { path: '/:offre/periodeOffre', verb: 'post'},
        returns : { type: 'object', root: true } 
    });





    //affichage des montant
    Parametre.factur = function (cb) {
        
        Parametre.find({
            where:{
                codeParam: "facturationHebergement"
            }
        }, (err, facturation) =>{
            console.log(facturation)
            if(err) cb(err, null)
            else
                cb(null, facturation);
        })
    }


    Parametre.remoteMethod('factur',
    {
        http:{ path: '/factur',verb:'get'},
        returns : { type: 'object', root: true } 
    });

};
