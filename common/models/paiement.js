'use strict';
const AppConfig = require( '../../server/global/app_config');
const axios = require('axios');
const CINETPAY_API = AppConfig.CINETPAY_API;
const CINETPAY_HOREOO_SITEID = AppConfig.CINETPAY_HOREOO_SITEID;
const CINETPAY_HOREOO_APIKEY = AppConfig.CINETPAY_HOREOO_APIKEY;
const notify = require('../../server/global/notify');

module.exports = function(Paiement) {

    Paiement.cinetpayNotifyPayment = function (cpm_trans_id, cb) {

        //const Subscription = Payment.app.models.subscription;
        //const Offer = Payment.app.models.offer;
        
        // var result = {
        //     success : false
        // };

       // res.redirect('https://host.name.com/path?data=${data}');
        const config = {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const params = new URLSearchParams()
        params.append('apikey', CINETPAY_HOREOO_APIKEY)
        params.append('cpm_site_id', CINETPAY_HOREOO_SITEID)
        params.append('method', 'checkPayStatus')
        params.append('cpm_trans_id', cpm_trans_id)
        params.append('awesome', true)

        axios.post(CINETPAY_API, params, config)
        .then((response) => {
            console.log(response);

            // const payment_reference = response.data.transaction.cpm_designation;
            // const payment_type = payment_reference.split('.')[0];
            // const transactionId = response.data.transaction.cpm_trans_id;
            // const subscriptionId = transactionId.split('.')[1];

            Paiement.findOrCreate(
                {
                    payment_phone_number : response.data.transaction.cel_phone_num,
                    payment_phone_preffix : response.data.transaction.cpm_phone_prefixe,
                    payment_status : response.data.transaction.cpm_trans_status == "ACCEPTED" ? "SUCCESS" : "FAILURE",
                    payment_trans_id : response.data.transaction.cpm_trans_id,
                    payment_trans_designation : response.data.transaction.cpm_designation,
                    payment_date_time : response.data.transaction.created_at,
                    // subscriptionId : payment_type == "SUBSCRIBE" ? subscriptionId : null,
                    payment_amount : response.data.transaction.cpm_amount,
                    payment_amount_currency : response.data.transaction.cpm_currency,
                    payment_provider_status : response.data.transaction.cpm_trans_status,
                    payment_provider: 'CINETPAY',
                    payment_provider_method : response.data.transaction.payment_method
                },
                (err, payment) => { 
                    console.log(payment);
                    if(err) throw err;

                    // if(response.data.transaction.cpm_trans_status == "ACCEPTED") {
                    //     if(payment_type == "SUBSCRIBE") {
                    //         activateSubscription(subscriptionId, response.data.transaction);

                    //     }
                    //     result.success = true;
                    // }

                    cb(null, payment);

                }
            )

        })
        .catch((e) =>{
            cb(null, payment);
        });
    }

    Paiement.remoteMethod('cinetpayNotifyPayment', {
          accepts:[
              { arg: 'cpm_trans_id', type: 'string' },
          ],
          http: { path: '/cinetpay/notifypayment', verb: 'post' },
          returns : { root: true, type : 'object' }        }
    );

};
