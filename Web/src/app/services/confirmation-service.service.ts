import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationServiceService {


  private userUrl = environment.baseApiUrl+'Users/';
  
  constructor(private cookieService: CookieService, private http: HttpClient) { }
  /**
   * 
   * @returns userEmail
   */
  public getUserByEmail(): Observable<User[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.get<User[]>(this.userUrl+"myShips/fromUsername", httpOptions)
      .pipe(map(user => { return user }));
  }
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
