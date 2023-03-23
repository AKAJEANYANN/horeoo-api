'use strict';
const notify = require("../../server/global/notify")

module.exports = function(Reservation) {
    
    Reservation.creation = function (req, cb){
        
        const Provider = Reservation.app.models.provider;
        const Hebergement = Reservation.app.models.hebergement;

         var infoReservation = req.body.infoReservation;
         var codeReservation =  Math.floor(Math.random() * 900000) + 100000;

        //  creation de reservation
        Reservation.create(infoReservation, (err, reserve) =>{
            console.log(reserve);
            if(err) cb(err, null)

            // modification du champ reservation number
            reserve.updateAttributes({
                codeReservation: codeReservation
            }, (err, reservation) =>{
                console.log(reservation);


                Hebergement.findOne({
                    where:{
                        id: reservation.hebergementId
                    }
                },(err, heberge)=>{
                    
                    console.log(heberge.providerId);

                    Provider.findOne({
                        where:{
                            id: heberge.providerId
                        }
                    },(err, prod)=>{

                        console.log(prod.device_fcm_token);

                        notify.sendPushNotification(
                            prod.device_fcm_token,
                            "Nouvelle réservation",
                            "Vous avez une réservation en attente",
                            "PRO"
                            );
                    })


                });

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
  



    Reservation.modifReser = function (idreservation, reservationEtat, idbot, cb) {


        Reservation.findById(
            idreservation,
            {
                include:[
                    {
                        relation: 'customer'
                    },
                    {
                        relation: 'hebergement',
                        scope:{
                            include:'provider'
                        }
                    }
                ] 
            },
            (err, reservation) =>{ 

                console.log(reservation);

                reservation.updateAttributes({
                    etatReservation: reservationEtat,
                    botId: idbot,
                    reservationDernierModif: Date.now()
                }, (err, reservation) =>{

                    var reservations = reservation.toJSON();
                    console.log(reservations["customer"]["device_fcm_token"]);
                 

                    if(err) cb(err, null)
                    else
                            
                        if(reservation.etatReservation === "2"){

                            const msisdn = reservations["customer"]["numero"];

                            const message = 'La réservation faite sur ' + reservations['hebergement']['typeHebergement'] + ' ' + '"' + reservations['hebergement']['nomHebergement'] + '"' +' a été validée !';
                            
                            notify.sendSMS(message, msisdn);

                            notify.sendPushNotification(
                                reservations["customer"]["device_fcm_token"],
                                "Réservation validée",
                                "Votre réservation a été validée !",
                                "CUS"
                                );
                        }
                        else if(reservation.etatReservation === "5" && reservations["customer"]["device_fcm_token"] != ""){

                            notify.sendPushNotification(
                                reservations["customer"]["device_fcm_token"],
                                "Réservation debutée",
                                "Votre réservation a debutée !",
                                "CUS"
                                );
                        }
                        else if(reservation.etatReservation === "6" && reservations["hebergement"]["provider"]["device_fcm_token"] && reservations["customer"]["device_fcm_token"] != ""){

                            notify.sendPushNotification(
                                reservations["customer"]["device_fcm_token"],
                                "Réservation terminée",
                                "Vous avez une réservation terminée !",
                                "CUS"
                                );

                            notify.sendPushNotification(
                                reservations["hebergement"]["provider"]["device_fcm_token"],
                                "Réservation terminée",
                                "Vous avez une réservation terminée !",
                                "PRO"
                                );

                        }


                    cb(null, reservation)
                })
            })

    }


    Reservation.remoteMethod('modifReser',
        {
            accepts: [
                {arg: 'idreservation', type: 'string'},
                {arg: 'reservationEtat', type: 'string'},
                {arg: 'idbot', type: 'string'}
        ],
           
            http: { path: '/:idreservation/modifReser', verb: 'post'},
            returns : { type: 'object', root: true } 
        });







        
    // Reservation.affichage = function (customerId, cb) {
        
    //     Reservation.find({
    //         where:{
    //             customerId: customerId
    //         },
    //         include:[
    //             {
    //                 relation:'customer'
    //             },
    //             {
    //                 relation:'offre',
    //                 scope:{
    //                     include:'hebergement'
    //                 }
    //             }
    //         ]
    //     }, (err, reservation) =>{
    //         console.log(reservation)
    //         if(err) cb(err, null)
    //         else
    //             cb(null, reservation);
    //     })
    // }


    // Reservation.remoteMethod('affichage',
    // {
    //     accepts: {arg: 'customerId', type: 'string'},
    //     http: { path: '/:customerId/affichage', verb: 'post'},
    //     returns : { type: 'object', root: true } 
    // });




    // Reservation.countReservation = function (providerId, etat, cb) {

    //         var sql;
    //         const Hebergement = Reservation.app.models.hebergement;
    //         var ds = Hebergement.dataSource;
    //         if (providerId != "" && etat != "") {
    //             sql = `SELECT COUNT(reservation.hebergementId) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' AND hebergement.activeHebergement = '1' AND reservation.reservationEtat = '${etat}' `;
    //         }
    //         else{
    //             sql = `SELECT COUNT(reservation.hebergementId) as count FROM hebergement,reservation WHERE hebergement.id = reservation.hebergementId AND hebergement.providerId = '${providerId}' AND hebergement.activeHebergement = '1' `;
    //         }
            
    //         ds.connector.query(sql, function (err, data){
    //             if(err) throw err
    //             console.log(data);
    //             cb(null, data);
    //         });
    // }


    // Reservation.remoteMethod('countReservation',
    //     {
    //         accepts:[ { arg: 'providerId', type: 'string', required: true },
    //             { arg: 'etat', type: 'string' }
    //      ],
    //         http: { path: '/countReservation', verb: 'get'},
    //         returns : { type: 'object', root: true } 
    //     });


      


       
};
