import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private user: User;

  constructor(private router: Router, private cookieService: CookieService) { }

  /**
   * Determines if the user is allowed access to route
   * @param route 
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    if (this.cookieService.check('user') && this.Authenticate(expectedRole)) {
      return true;
    }
    else {
      this.router.navigate(["/logind"]);
      return false;
    }
  }

  /**
   * Authenticates the users role with the necesarry role for the route
   * @param expectedRole 
   */
  Authenticate(expectedRole): boolean {
    this.user = JSON.parse(this.cookieService.get('user'));
    const tokenDecoded = this.getDecodedAccessToken(this.user.token);

    if (expectedRole === "admin" && tokenDecoded.role !== expectedRole)
      return false;
    else
      return true;
  }

  /**
   * Decodes the token
   * @param token 
   */
  getDecodedAccessToken(token: string): any {
    try {
      return decode(token);
    }
    catch (error) {
      return null;
    }
  }

}
