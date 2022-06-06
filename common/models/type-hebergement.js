'use strict';

module.exports = function(Typehebergement) {

    Typehebergement.actif = function (id, cb) {

        Typehebergement.findById(
            id,
            (err, typehebergement) =>{
                console.log(typehebergement)
                typehebergement.updateAttributes({
                    actifTypeHebergement: true,
                },(err, typeheberge) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, typeheberge)
                })
            })
    }
    
    
    Typehebergement.remoteMethod('actif',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/actif', verb: 'post'},
        returns : { type: 'object', root: true } 
    });

};
