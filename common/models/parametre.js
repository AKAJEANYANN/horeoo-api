'use strict';

module.exports = function(Parametre) {

    // api de facturation pour chaque client envoyé
    Parametre.facturation = function (montant, cb) {

        // var montant = req.body.montant;

        Parametre.findOne({
            where:{
                code: "facturationHebergement"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeur: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeur: montant,
                    code: "facturationHebergement",
                    designation: "Montant prélevé pour chaque client envoyer",
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
                code: "minRecharge"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeur: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeur: montant,
                    code: "minRecharge",
                    designation: "Montant minimum de rechargement",
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
                code: "soldeAlerte"
            }
        },(err, facturation)=>{
            console.log(facturation);

            if(facturation){

                facturation.updateAttributes({
                    valeur: montant,
                    dateModifParam: Date.now()
                },(err, facture)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, facture);
    
                })
            }
            else {
                Parametre.create({
                    valeur: montant,
                    code: "soldeAlerte",
                    designation: "Montant à partir duquel un message vous sera envoyé",
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
                code: "periodeOffre"
            }
        },(err, periode)=>{
            console.log(periode);

            if(periode){

                periode.updateAttributes({
                    valeur: offre,
                    dateModifParam: Date.now()
                },(err, periode)=>{
                    if(err) cb(err, null)
                    else
                        cb(null, periode);
    
                })
            }
            else {
                Parametre.create({
                    valeur: offre,
                    code: "periodeOffre",
                    designation: "Periode des offres",
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
                code: "facturationHebergement"
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



    

    
    // api de facturation pour chaque client envoyé
    // Parametre.pourcenTranchResi = function (poucentage, cb) {

    //     // var poucentage = req.body.poucentageTranch;

    //     Parametre.findOne({
    //         where:{
    //             code: "percentTrancheResidence"
    //         }
    //     },(err, poucent)=>{

    //         if(poucent){

    //             poucent.updateAttributes({
    //                 valeur: poucentage,
    //                 dateModifParam: Date.now()
    //             },(err, poucent)=>{
    //                 if(err) cb(err, null)
    //                 else
    //                     cb(null, poucent);
    
    //             })
    //         }
    //         else {
    //             Parametre.create({
    //                 valeur: poucentage,
    //                 code: "percentTrancheResidence",
    //                 designation: "Pourcentage tranche résidence",
    //                 dateModifParam: Date.now()
    //             },(err, pourcent)=>{
    //                 console.log(pourcent);
    //                 if(err) cb(err, null)
    //                 else
    //                     cb(null, pourcent);
    //             })
    //         }
            

    //     })

    // }
    
    
    // Parametre.remoteMethod('pourcenTranchResi',
    // {
    //     accepts: { arg: 'poucentage', type: 'string' },
    //     http: { path: '/:poucentage/pourcenTranchResi', verb: 'post'},
    //     returns : { type: 'object', root: true } 
    // });

};
