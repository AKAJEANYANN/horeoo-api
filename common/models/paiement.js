'use strict';
const AppConfig = require( '../../server/global/app_config');
const axios = require('axios');
const CINETPAY_API = AppConfig.CINETPAY_API;
const CINETPAY_HOREOO_SITEID = AppConfig.CINETPAY_HOREOO_SITEID;
const CINETPAY_HOREOO_APIKEY = AppConfig.CINETPAY_HOREOO_APIKEY;
const notify = require('../../server/global/notify');

module.exports = function(Paiement) {

    Paiement.cinetpayNotifyPayment = function (cpm_trans_id, cb) {
        // var $secretKey= "349869360634d2c76110653.28929780";
        // var 
        // var $data = $cel_phone_num . $cpm_phone_prefixe . $cpm_trans_status . $cpm_trans_id . $cpm_designation . 
        // $created_at . $cpm_amount . $cpm_currency . $cpm_trans_status .$payment_method;
        // $token = hash_hmac(‘SHA256’, $cel_phone_num . $cpm_phone_prefixe . $cpm_trans_status . $cpm_trans_id . $cpm_designation . 
        //     $created_at . $cpm_amount . $cpm_currency . $cpm_trans_status .$payment_method, "349869360634d2c76110653.28929780");
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

        axios.post(CINETPAY_API, params, config)
        .then((response) => {
            console.log(response);

            const payment_reference = response.data.transaction.cpm_designation;
            console.log(payment_reference);
            // const payment_type = payment_reference.split('.')[0];
            // const transactionId = response.data.transaction.cpm_trans_id;
            // const subscriptionId = transactionId.split('.')[1];

            Paiement.findOrCreate(
                {
                    phoneNumeroPayment : response.data.transaction.cel_phone_num,
                    phonePrefixPayment : response.data.transaction.cpm_phone_prefixe,
                    statusPayment : response.data.transaction.cpm_trans_status == "ACCEPTED" ? "SUCCESS" : "FAILURE",
                    referencePayment : response.data.transaction.cpm_trans_id,
                    detailPayment : response.data.transaction.cpm_designation,
                    dateMotifPayment : response.data.transaction.created_at,
                    montantPayment : response.data.transaction.cpm_amount,
                    deviseMontantPayment : response.data.transaction.cpm_currency,
                    paymentProviderStatus : response.data.transaction.cpm_trans_status,
                    paymentType: 'CINETPAY',
                    paymentProviderMethod : response.data.transaction.payment_method
                },
                (err, payment) => { 
                    // console.log(payment);
                    if(err) cb(err, null)
                    else
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
