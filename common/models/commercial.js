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
};
