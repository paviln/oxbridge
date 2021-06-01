import { email } from '../config/config';


const nodemailer = require('nodemailer');

export let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: email.user,
      pass: email.pass,
      clientId: email.clientId,
      clientSecret: email.clientSecret,
      refreshToken: email.refreshToken
    },
});