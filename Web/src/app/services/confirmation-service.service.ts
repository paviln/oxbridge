import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationServiceService {


  private eventRegistrationUrl = environment.baseApiUrl+'eventRegistrations/';
  
  constructor(private cookieService: CookieService, private http: HttpClient) { }

  private nodemailer = require('nodemailer');
  public transporter = this.nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  private mailOptions = {
    from: '',
    to: '',
    subject: 'Race Registration Confirmation Email',
    Text: 'You have been registered.'
  }
  public sendEmail(){

  }

}
