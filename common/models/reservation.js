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



        Reservation.affiche = function (customerId, cb) {
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
                    cb(null, reservation)
            })
        }


    Reservation.remoteMethod('affiche',
    {
        accepts: {arg: 'customerId', type: 'string'}
        ,
        http: { path: '/affiche', verb: 'get'},
        returns : { type: 'object', root: true } 
    });
  
};
