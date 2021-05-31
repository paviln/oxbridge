import { email } from '../config/config';


const nodemailer = require('nodemailer');

export let transporter = nodemailer.createTransport({
    host: 'smpt.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: email.user,
      pass: email.pass,
      clientId: email.clientId,
      clientSecret: email.clientSecret,
      refreshToken: email.refreshToken
    },
  });
  /*
  transporter.set('oauth2_provision_cb', (user, renew, callback) => {
    let accessToken = userTokens[user];
    if(!accessToken){
        return callback(new Error('Unknown user'));
    }else{
        return callback(null, accessToken);
    }
});
*/