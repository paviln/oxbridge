import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import * as decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private userUrl = 'https://oxbridgecloud.azurewebsites.net/users/'

  private userUrl = 'http://localhost:3000/users/';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Sends a http post request to the backend, in order to register as a new user
   * @param newUser - The new user to be registered
   */
  public registerUser(newUser: User): Observable<User> {
    return this.http.post<User>(this.userUrl+"register", newUser).pipe(map(user => {
      user.role = this.getDecodedAccessToken(user.token).role;
      return user;
    }));
  }

  /**
   * Sends a http post request to the backend, in order to login
   * @param emailUsername - The emailUsername of the user
   * @param password - The password of the user
   */
  public login(emailUsername:string, password:string): Observable<User> {
    return this.http.post<User>(this.userUrl+'login', {emailUsername, password}).pipe(map(user => {
      user.role = this.getDecodedAccessToken(user.token).role;
      return user;
    }));
  }

  /**
   * Decodes the given token
   * @param token - The token that should be decoded
   */
  getDecodedAccessToken(token: string): any {
    try {
      return decode(token);
    }
    catch (error) {
      return null;
    }
  }

  /**
   * Sends a http put request to the backend, in order to update a user
   * @param newUser - The updated user
   */
  public updateUser(newUser): Observable<User>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.put<User>(this.userUrl+user.emailUsername, newUser, httpOptions).pipe(map(user => { return user }));
  }
}
