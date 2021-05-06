import { Component } from '@angular/core';
import { User } from './models/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Tregatta';
  public user: User;
  public open: boolean;

  constructor(private cookieService: CookieService, private router: Router) {
    this.open = true;
    this.updateUser();
  }

  /**
   * Updates the user to the user saved in cookies
   */
  public updateUser() {
    if (this.cookieService.check('user'))
      this.user = JSON.parse(this.cookieService.get('user'));
    else
      this.user = null;
  }

  /**
   * Event handler for the dropdown button
   */
  dropDownClicked() {
    if (this.open)
      this.open = false;
    else
      this.open = true;
  }

  /**
   * Deletes the user from cookies and sets the user to null
   */
  LogOut() {
    this.cookieService.deleteAll('user');
    this.user = null;
    this.router.navigateByUrl('/hjem');
  }

  /**
   * Navigates to a specific path depending on the saved user information
   */
  registrationClicked() {
    if (this.cookieService.check('user')) {
      let user = JSON.parse(this.cookieService.get('user'));
      if (user.role === 'admin')
        this.router.navigateByUrl('/administrerEvents');
      else
        this.router.navigateByUrl('/mineEvents');
    }
    else
      this.router.navigateByUrl('/tilmelding');
  }
}
