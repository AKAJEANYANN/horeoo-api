'use strict';

module.exports = function(Bot) {
    Bot.fournisseurBot = function (req, cb) {
        var botMessage = req.body.botMessage;
        var etatReservation = req.body.etatReservation;

        Bot.create(
            {
                botForUser: false,
                activeBot: true,
                botMessage: botMessage,
                etatReservation: etatReservation
            },
            (err, bot)=>{
                console.log(bot);
                if(err)cb(err, null)
                else
                    cb(null, bot)
            })
    }

    Bot.remoteMethod('fournisseurBot',
    {
        accepts: { arg: 'req', type: 'object', 'http': {source: 'req'}},
        http: { path: '/fournisseurBot', verb: 'post'},
        returns : { type: 'object', root: true } 
    });
};
