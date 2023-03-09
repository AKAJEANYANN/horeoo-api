'use strict';

module.exports = function(Equipement) {

    Equipement.delete = function (id, cb) {
        Equipement.findById(
            id,
            (err, equipement) =>{
                if(equipement){
                equipement.delete((err, he)=>{
                    cb(null, 'Equipement supprimé')
                })
            }
            })
    }
    
    
    Equipement.remoteMethod('delete',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/delete', verb: 'post'},
        returns : { type: 'object', root: true } 
    });




    Equipement.actif = function (id, cb) {

        Equipement.findById(
            id,
            (err, equipement) =>{

                console.log(equipement)
                if (equipement) {
                    equipement.updateAttributes({
                        actifEquipement: true,
                    },(err, equipement) =>{
                        
                        cb(null, equipement)
                    })
                }
                
            })
    }
    
    
    Equipement.remoteMethod('actif',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/actif', verb: 'post'},
        returns : { type: 'object', root: true } 
    });



    Equipement.recherche = function (listEquipement, cb) {

        
        var list = listEquipement.split(',');

        Equipement.find({
            where:{
                id: {
                    inq: list
                }
            }
        },(err, equipement)=>{
            console.log(equipement);
            if(err) cb(err, null)
            else
                cb(null, equipement);
        })
    }



    Equipement.remoteMethod('recherche',
    {
        accepts:{ arg: 'listEquipement', type: 'string'},
        http: { path: '/recherche', verb: 'get'},
        returns : { type: 'object', root: true } 
    });

};
