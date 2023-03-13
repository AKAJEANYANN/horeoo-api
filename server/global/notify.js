const axios = require('axios');
var app = require('../../server/server');
var path = require('path');


// Sending SMS function
const sendSMS = (message,msisdn) => {

    const options = {
        method: 'POST',
        url: 'https://api-public-2.mtarget.fr/messages',
        params: {
          username: 'habiteax',
          password: 'YXcdSKzHrvI9',
          msg: message,
          sender: "HOREOO",
          msisdn: msisdn,
          allowunicode: 'true'
        }
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });

}


const sendPushNotification = (deviceId, title, body, action) => {
  const FCM_KEY ="key=AAAA4Pw0mlM:APA91bGLTrGSgy_QLUM5ZSRML7bDRCjO2b_m8aZXGklPoebjgb_h5oVsv_chXh-53kXL0PZtOdtDVws0ZRsTFR2nTAuAPjHfz-omyhvgJPsKc4QBYwe5ZXuJPEbGedsvjj6mgvRPfXza"
  var fcmData = {
      "notification": {"body": body, "title": title},
      "priority": "high",
      "data": {
        "action": action
      },
      "to": deviceId
    }
  axios.post(
      "https://fcm.googleapis.com/fcm/send",
      fcmData,
      {
          headers: {
              'Authorization': FCM_KEY,
          }
      }
  ).then(function(res) {
      console.log(res);
  });
}

module.exports = { 
  sendSMS,
  sendPushNotification
}