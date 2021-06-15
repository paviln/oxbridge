import { transporter } from './index'
/**
 * EmailResetPassword sends an email to 
 * the user who forgot their password
 * and provides a new temporary password.
 */
export default class EmailForgotPassword {

  userEmail: string;
  password: string;

  /**
   *
   */
  constructor(userEmail: string, password: string) {
    this.userEmail = userEmail;
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
      to: this.userEmail,
      subject: "Reset Password Request",
      text: "Your temporary password is: " + this.password,
      headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }

    }).catch((error: any) => {
      console.error(error);
    });
  }

}
