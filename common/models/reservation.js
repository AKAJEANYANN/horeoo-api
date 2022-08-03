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




        Reservation.countReservation = function (providerId, etat, cb) {

            var providerId = req.body.providerId;
            var etat = req.body.etat;

            var sql;
            const Hebergement = Reservation.app.models.hebergement;
            var ds = Hebergement.dataSource;
            
            if (providerId != "" && etat != "") {
                sql = `SELECT COUNT(reservation.hebergementId) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' AND reservation.reservationEtat = '${etat}' `;
            }
            else{
                sql = `SELECT COUNT(reservation.hebergementId) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' `;
            }
            
            ds.connector.query(sql, function (err, data){
                if(err) throw err
                console.log(data);
                cb(null, data);
            });
    }


    Reservation.remoteMethod('countReservation',
        {
            accepts:[ { arg: 'providerId', type: 'string', required: true },
                { arg: 'etat', type: 'string' }
         ],
            http: { path: '/countReservation', verb: 'get'},
            returns : { type: 'object', root: true } 
        });


    
};
