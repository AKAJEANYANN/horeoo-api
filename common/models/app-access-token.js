'use strict';

module.exports = function(Appaccesstoken) {

    // suppression d'un token lorsque le user exist
    Appaccesstoken.deleteOtherToken = function (userId, token, cb) {

        // var userId = req.body.userId;
        // var token = req.body.token;
        // Appaccesstoken.delete({
        //     userId: userId,
        //     id: token
        // },(err, ap)=>{
        //     cb(null, "ok");
        // })
        Appaccesstoken.find({
            where:{
                userId: userId,
            }
        },(err, app)=>{
            console.log(app);
            app.forEach(element => {
                if (element["id"]!= token && element["userId"] == userId) {
                    element.delete()
                }
            });
            
            cb(null, "ok");
        })
        

        
    };


    Appaccesstoken.remoteMethod('deleteOtherToken',
        {
            accepts: [
                { arg: 'userId', type: 'string' },
                { arg: 'token', type: 'string', required: true },
                // { arg: 'req', type: 'object', 'http': {source: 'req'}},
            ],
            http: { path: '/:userId/deleteOtherToken', verb: 'delete'},
            returns : { type: 'object', root: true } 
        });

};
