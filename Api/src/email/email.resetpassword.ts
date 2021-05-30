import { transporter } from './index'
import UserRepo from '../database/user.repo';
import User, { IUser } from '../models/user';

/**
 * EmailResetPassword sends an email to 
 * the user who forgot their password
 * and provides a new temporary password.
 */
export default class EmailResetPassword {

  user: IUser;
  password: String;

  /**
   *
   */
  constructor(user: IUser, password: String) {
    this.user = user;
    this.password = password;
    try {
      this.pwTask();
    } catch (error) {
      console.error(error);
    }
  }

  async pwTask(): Promise<void> {


    const email = await transporter.sendMail({
      from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
      to: this.user.emailUsername,
      subject: "Reset Password Request",
      text: "Your temporary password is: " + this.password,
      headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }

    }).catch((error: any) => {
      console.error(error);
    });
  }

}
