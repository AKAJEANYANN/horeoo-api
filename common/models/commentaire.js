'use strict';

module.exports = function(Commentaire) {

    Commentaire.comment = function (req ,cb) {

        var infoData = req.body.info;
        

        Commentaire.findOne({
                where: {
                    customerId : infoData.customerId,
                    hebergementId: infoData.hebergementId,
                }
            }, (err, commentaire) => {

                // cas 1 commentaire existe: 
                if(commentaire){
                    
                    // mettre a jour le commentaire
                    commentaire.updateAttributes({
                        images : infoData.images,
                        commentaire : infoData.commentaire,
                        note : infoData.note
                    },(err, comment) => {
                        console.log(comment);
                        if(err) cb(err, null)
                        else 
                            cb(null, comment);

                        })            
                }
                // cas 2 le commentaire n'existe pas
                else {

                    // creer le commentaire  
                    Commentaire.create(infoData,
                        (err, comme) => {
                            if(err) cb(err, null); 
                            else 
                                cb(null, comme);

                        });
                }
            })
        
        
    };

    Commentaire.remoteMethod('comment',
    {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http: { path: '/customer/commentaire', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
