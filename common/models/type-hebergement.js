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





    Typehebergement.byProvider = function (providerId, cb) {


        Typehebergement.find({
            where:{
                actifTypeHebergement: true
            },
            include:{
                relation:'hebergements',
                scope:{
                    where:{providerId: providerId,
                    activeHebergement: true
                    },
                    include:{
                        relation: 'offre',

                        scope:{limit: 1}
                    }
                }
            }
        }
            ,
           (err, heberprovider)=>{
            console.log(heberprovider);
            if(err) cb(err, null)
            else
                cb(null, heberprovider)
           
            })
    }
    
    
    Typehebergement.remoteMethod('byProvider',
    {
        accepts: { arg: 'providerId', type: 'string' },
        http: { path: '/byProvider', verb: 'get'},
        returns : { type: 'object', root: true } 
    });






};
