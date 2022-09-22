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


    

    Commercial.affichecom = function (req, cb) {
        var approuveCommercial = req.body.approuveCommercial;
        Commercial.find({
            where:{
                approuveCommercial: approuveCommercial
            },
            include: 'hebergements'
            },(err, commercial) =>{
                if(err) cb(err, null)
                else cb(null, commercial)
        })
    
    }
    
    Commercial.remoteMethod('affichecom', {
        accepts: [
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
        ],
        http:{ path: '/affichecom',verb:'post'},
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
