'use strict';

const AppConfig = require( '../../server/global/app_config');
const axios = require('axios');
const moment = require('moment');
const CINETPAY_API = AppConfig.CINETPAY_API;
const CINETPAY_HOREOO_SITEID = AppConfig.CINETPAY_HOREOO_SITEID;
const CINETPAY_HOREOO_APIKEY = AppConfig.CINETPAY_HOREOO_APIKEY;
const notify = require('../../server/global/notify');
// const post = require('./post');


module.exports = function(Paiement) {

    var sendPaymentReceiptSms = function (paiement, motif){
        const msisdn = paiement.phonePrefixPaiement + paiement.phoneNumeroPaiement;
        const message = 'Cher client, votre paiement de ' + paiement.montantPaiement +' FCFA a été éffectué avec succès. '+ motif ;
        console.log('sendPaymentReceiptSms send');
        notify.sendSMS(msisdn, message);
    }


    Paiement.cinetpayCheckPayment = function (cpm_trans_id, cb) {

        var result = {
            success : false
        };

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

            if(response.data.transaction.cpm_trans_status == "ACCEPTED") {
                const transactionId = response.data.transaction.cpm_trans_id;
                const offerId = transactionId.split('.')[2];
                const clientId = transactionId.split('.')[0];

                // if(paiement_type == "HEBERGEMENT"){
                //     const clientId = transactionId.split('.')[0];
                // }
                // else if(payment_type == "EVENEMENT"){
                //     const evenementId = transactionId.split('.')[0];
                // } 

                result.success = true;
            }else if (response.data.transaction.cpm_trans_status == "" ){
                result.success = null;
            }
            cb(null, result);

        })
        .catch((e) =>{
            cb(null, result);
        });

    }

    Paiement.remoteMethod('cinetpayCheckPayment', {
          accepts:[
              { arg: 'cpm_trans_id', type: 'string' },
          ],
          http: { path: '/cinetpay/checkpayment', verb: 'post' },
          returns : { root: true, type : 'object' }
        }
    );


    Paiement.cinetpayNotifyPayment = function (cpm_trans_id, cb) {

        //const Subscription = Payment.app.models.subscription;
        //const Offer = Payment.app.models.offer;
        
        var result = {
            success : false
        };

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

            const paiement_reference = response.data.transaction.cpm_designation;
            const paiement_reference_array =  paiement_reference.split('.');
            const paiement_type = paiement_reference_array[0];
            const transactionId = response.data.transaction.cpm_trans_id;

            var offerId = paiement_reference_array[3];
            var customerId = paiement_reference_array[2];
            var clientId = paiement_reference_array[1];
            

            // if(paiement_type.toLowerCase() == "hebergement"){
            //     clientId = paiement_reference_array[1];
                
            // }
            // else if(paiement_type.toLowerCase() == "evenement"){
            //     clientId = paiement_reference_array[1];
            // }
            

            Paiement.findOrCreate(
                {
                    dateCreationPaiement : response.data.transaction.created_at,
                    phonePrefixPaiement : response.data.transaction.cpm_phone_prefixe,
                    phoneNumeroPaiement : response.data.transaction.cel_phone_num,
                    montantPaiement : response.data.transaction.cpm_amount,
                    deviseMontantPaiement : response.data.transaction.cpm_currency,
                    statusPaiement : response.data.transaction.cpm_trans_status == "ACCEPTED" ? "SUCCESS" : "FAILURE",
                    paiementProvider: 'CINETPAY',
                    paiementProviderMethod : response.data.transaction.payment_method,
                    paiementProviderStatus: response.data.transaction.cpm_trans_status,
                    paiementType: paiement_type,
                    referencePaiement: paiement_reference,
                    transacIdPaiement: transactionId,
                    offerId: offerId,
                    clientId: clientId,
                    customerId: customerId,
                },
                (err, payment) => { 
                    if(err) throw err;

                    if(response.data.transaction.cpm_trans_status == "ACCEPTED") {
                        if(paiement_type.toLowerCase() == "hebergement") {
                            sendPaymentReceiptSms(payment,"Votre hébergement a été mise à jour.");
                        }
                        else if(paiement_type.toLowerCase() == "evenement"){
                            activateWorker(offerId, customerId); 
                            sendPaymentReceiptSms(payment,"Votre événement a été activé.");
                        }
                        result.success = true;
                    }
                    cb(null, result);
                }
            )

        })
        .catch((e) =>{
            cb(null, result);
        });
    }

    Paiement.remoteMethod('cinetpayNotifyPayment', {
          accepts:[
              { arg: 'cpm_trans_id', type: 'string' },
          ],
          http: { path: '/cinetpay/notifypayment', verb: 'post' },
          returns : { root: true, type : 'object' }        
        }
    );
};
