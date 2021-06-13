import nodemailer from 'nodemailer';
import {mailConfigTest, mailOptions} from '../config/config';

const env = process.env.NODE_ENV;
const transporter = nodemailer.createTransport(env === 'production' ? mailOptions : mailConfigTest);

const SendReminder = async (emailUsername: string, date: Date) => {
  const email = await transporter.sendMail({
    from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
    to: emailUsername,
    subject: "Reminder",
    text: "You have a event which starts the: " + date,
    headers: { 'x-myheader': 'Tregatta/Oxbridge Event Reminder' }

  }).catch((error: any) => {
    console.error(error);
  });

  return email;
}

export {
  SendReminder,
}