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




    Typehebergement.deletetypheber = function (id, cb) {

        const Hebergement = Typehebergement.app.models.hebergement;

        Typehebergement.findById(
            id,
           (err, typeheber)=>{
            console.log(typeheber);
            Hebergement.find({
                where:{
                    typeHebergementId: typeheber.id
                }
            },(err, heberge)=>{
                console.log(heberge);
                if(heberge.length !=0){
                    typeheber.updateAttributes({
                        actifTypeHebergement: false
                    },(err, heb)=>{
                        cb(null, heb)
                    })
                }else{
                    typeheber.delete((err, he)=>{
                        cb(null, 'type hebergement supprimé')
                    })
                }
            })
            
            })
    }
    
    
    Typehebergement.remoteMethod('deletetypheber',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/deletetypheber', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
