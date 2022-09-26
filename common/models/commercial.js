'use strict';

module.exports = function(Commercial) {
    Commercial.approve = function (id, cb) {
        Commercial.findById(
            id,
            (err, commercial) =>{
                commercial.updateAttributes({
                    approuveCommercial: true,
                    approval_datetime: Date.now()
                },(err, commercial) =>{
                    if(err) cb(err, null)
                    else
                    cb(null, commercial)
                })
            })
    }
    
    
    Commercial.remoteMethod('approve',
    {
        accepts: { arg: 'id', type: 'string' },
        http: { path: '/:id/approve', verb: 'post'},
        returns : { type: 'object', root: true } 
    });


    

    Commercial.affichecomapprouve = function (cb) {
        Commercial.find({
            where:{
                approuveCommercial: true
            },
            include: 'hebergements'
            },(err, commercial) =>{
                if(err) cb(err, null)
                else cb(null, commercial)
        })
    
    }
    
    Commercial.remoteMethod('affichecomapprouve', {
        http:{ path: '/affichecomapprouve',verb:'get'},
        returns: {type: 'object', root: true}
    });




    Commercial.affichecomdesapprouve = function (cb) {
        Commercial.find({
            where:{
                approuveCommercial: false
            },
            include: 'hebergements'
            },(err, commercial) =>{
                if(err) cb(err, null)
                else cb(null, commercial)
        })
    
    }
    
    Commercial.remoteMethod('affichecomdesapprouve', {
        http:{ path: '/affichecomdesapprouve',verb:'get'},
        returns: {type: 'object', root: true}
    });




    Commercial.affichecomid = function (codeCommercial, cb) {

        var codeCommercial = req.body.codeCommercial;
        console.log(codeCommercial);
        var filter = {
            where:{
                codeCom: codeCommercial
            }};
        Commercial.find(
            filter
            ,(err, commercial) =>{
                console.log(commercial);
                if(err) cb(err, null)
                else if(commercial.length > 0)
                    cb(null, commercial[0].id)
                else
                    cb(null, "")
        })
    
    }
    
    Commercial.remoteMethod('affichecomid', {
        accepts: 
            { arg: 'codeCommercial', type: 'string'},
        http:{ path: '/affichecomid',verb:'get'},
        returns: {type: 'object', root: true}
    });


    
};
