import nodemailer from 'nodemailer';
import {mailConfigTest, mailOptions} from '../config/config';
import User from '../models/user';
import Ship from '../models/ship';
import Event from '../models/event';

const env = process.env.NODE_ENV;
const transporter = nodemailer.createTransport(env === 'production' ? mailOptions : mailConfigTest);

const sendReminder = async (emailUsername: string, date: Date) => {
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

const emailConfirmation = async (shipId: number, eventId: number) => {       
  const ship = await Ship.findOne({shipId: shipId});
  if(!ship) return;
  const user = await User.findOne({emailUsername: ship.emailUsername});
  if(!user) return;
  const event = await Event.findOne({eventId: eventId});
  if(!event) return;
  const emaild = await transporter.sendMail({
      from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
      to: user.emailUsername,
      subject: 'Dear Participant, you are now registered for: ' + event.name,
      html: `<h1>Email Confirmation</h1>
              <h2>Hello ${user.firstname}</h2>
              <p>Thank you for signing up on ${event.name}. Your event starts at: ${event.eventStart}</p>
              </div>`,
      headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }
  }).catch((err: any) => console.log(err));
}

const sendPassword = async (emailUsername: string) => {
  const email = await transporter.sendMail({
    from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
    to: emailUsername,
    subject: "Reset Password Request",
    text: "Your temporary password is: " + 1234,
    headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }

  }).catch((error: any) => {
    console.error(error);
  });
}

export {
  sendReminder,
  emailConfirmation,
  sendPassword,
}