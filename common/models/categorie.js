'use strict';

module.exports = function(Categorie) {
    Categorie.creation = function (req ,cb) {

        var nomCategorie = req.body.nomCategorie;


        if(nomCategorie != null && nomCategorie != undefined && nomCategorie != ""){

            Categorie.findOne({
                where: {
                    libelle : nomCategorie
                }
            }, (err, categorie) => {

                if(err) cb(err, null)
                else

                // cas 1 la categorie existe: 
                if(categorie.libelle == nomCategorie){
                    
                    cb(null, nomCategorie + "existe")
                }
                // cas 2 l'utilsiateur n'existe pas
                else {

                    // creer l'utilisateur avec son numero de tel 
                    Categorie.create(
                        {
                            libelle : nomCategorie 
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
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/creation', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
