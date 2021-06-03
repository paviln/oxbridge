
import { getEmailInfo, mailOptions } from '../config/config';
import nodemailer from 'nodemailer';

//Instantiate the SMTP server
export const transporter = nodemailer.createTransport(mailOptions);