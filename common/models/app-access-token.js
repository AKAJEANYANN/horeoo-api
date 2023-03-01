'use strict';

module.exports = function(Appaccesstoken) {

    // suppression d'un token lorsque le user exist
    Appaccesstoken.deleteOtherToken = function (req) {

        var userId = req.body.userId;
        var token = req.body.token;
        
        Appaccesstoken.delete({
            where:{
                userId: userId,
                id: {neq:token}
            }
        },(err, app)=>{
            console.log(app);
        })

        
    };


    Appaccesstoken.remoteMethod('deleteOtherToken',
        {
            accepts: [
                { arg: 'req', type: 'object', 'http': {source: 'req'}},
            ],
            http: { path: '/deleteOtherToken', verb: 'post'},
            returns : { type: 'object', root: true } 
        });

};
