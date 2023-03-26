'use strict';

module.exports = function(Categorie) {
    Categorie.creation = function (nomLibelle ,cb) {


        if(nomLibelle != null && nomLibelle != undefined && nomLibelle != ""){

            Categorie.findOne({
                where: {
                    libelle : nomLibelle
                }
            }, (err, categorie) => {

                if(err) cb(err, null)
                else

                // cas 1 la categorie existe: 
                if(categorie.libelle == nomLibelle){
                    
                    cb(null, nomLibelle + "existe")
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Categorie.create(
                        {
                            libelle : nomLibelle 
                        },
                        (err, categorie) => {
                            if(err) cb(err, null);
                            else 
                                cb(null, categorie);
                        });
                }
            })
        }
        else{
            cb({status: 401, message: "Veuillez entrer le nom de votre categorie"}, null)
        } 
        
    };

    Categorie.remoteMethod('creation',
    {
        accepts: [
            { arg: 'nomLibelle', type: 'string',},
        ],
        http: { path: '/creation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
