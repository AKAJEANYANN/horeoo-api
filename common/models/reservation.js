'use strict';


module.exports = function(Reservation) {
    
    Reservation.creation = function (req, cb){
        
         var infoReservation = req.body.infoReservation;
         var codeReservation =  Math.floor(Math.random() * 900000) + 100000;
        
        //  creation de reservation
        Reservation.create(infoReservation, (err, reservation) =>{
            console.log(reservation);
            if(err) cb(err, null)

            // modification du champ reservation number
            reservation.updateAttributes({
                reservationNumber: codeReservation
            }, (err, reservation) =>{
                console.log(reservation);
                if(err) cb(err, null)
                else cb (null, reservation)
            })
        })
    }


    
    Reservation.remoteMethod('creation',
        {
            accepts: 
                { arg: 'req', type: 'object', 'http': {source: 'req'}},
           
            http: { path: '/creation', verb: 'post'},
            returns : { type: 'object', root: true } 
        });




        
    Reservation.affiche = function (customerId, hebergementId, reservationEtat, cb) {
        Reservation.find({
            where:{
                customerId: customerId,
                hebergementId: hebergementId,
                reservationEtat: reservationEtat
            },
            include:[
                {
                    relation:'customer'
                },
                {
                    relation:'offre',
                    scope:{
                        include:'hebergement'
                    }
                }
            ]
        }, (err, reservation) =>{
            console.log(reservation)
            if(err) cb(err, null)
            else
                cb(null, reservation)
        })
    }


    Reservation.remoteMethod('affiche',
    {
        accepts: [{arg: 'customerId', type: 'string'},
        {arg: 'hebergementId', type: 'string'},
        {arg: 'reservationEtat', type: 'string'}],
        http: { path: '/affiche', verb: 'get'},
        returns : { type: 'object', root: true } 
    });
  



    Reservation.modifReser = function (req, idreservation, cb) {
        
        var reservationEtat = req.body.reservationEtat;
        var idbot = req.body.idbot;

        Reservation.findById(
            idreservation,
            (err, reservation) =>{
                reservation.updateAttributes({
                    reservationEtat: reservationEtat,
                    botId: idbot,
                    reservationDernierModif: Date.now()
                }, (err, reservation) =>{
                    if(err) cb(err, null)
                    else
                        cb(null, reservation)
                })
            })

    }


    Reservation.remoteMethod('modifReser',
        {
            accepts: 
                [{ arg: 'req', type: 'object', 'http': {source: 'req'}},
                { arg: 'idreservation', type: 'string' }],
           
            http: { path: '/:idreservation/modifReser', verb: 'post'},
            returns : { type: 'object', root: true } 
        });




    Reservation.affichage = function (customerId, cb) {
        
        Reservation.find({
            where:{
                customerId: customerId
            },
            include:[
                {
                    relation:'customer'
                },
                {
                    relation:'offre',
                    scope:{
                        include:'hebergement'
                    }
                }
            ]
        }, (err, reservation) =>{
            console.log(reservation)
            if(err) cb(err, null)
            else
                cb(null, reservation);
        })
    }


    Reservation.remoteMethod('affichage',
    {
        accepts: {arg: 'customerId', type: 'string'},
        http: { path: '/:customerId/affichage', verb: 'post'},
        returns : { type: 'object', root: true } 
    });


    
};
