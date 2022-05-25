const axios = require('axios');
var app = require('../../server/server');
var path = require('path');


// Sending SMS function
const sendSMS = (phoneCustomer, message) => {

    const options = {
        method: 'POST',
        url: 'https://api-public-2.mtarget.fr/messages',
        params: {
          username: 'gladux',
          password: 'hdLgeNHoBA92',
          msg: message,
          sender: "INFO",
          msisdn: phoneCustomer,
          allowunicode: 'true'
        }
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });

}

module.exports = { 
    sendSMS
}