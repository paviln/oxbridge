import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public model: User;
  public wrongLogin: boolean = false;
  public wrongPassword: boolean = false;

  constructor(private userService: UserService, private cookieService: CookieService, private router: Router, private appComponent: AppComponent) {
    this.model = new User();
  }

  ngOnInit(): void {
  }

  /**
   * Event handler for clicking login
   */
  OnSubmit() {
    this.userService.login(this.model.emailUsername, this.model.password).pipe(first())
      .subscribe(user => {
        this.cookieService.set('user', JSON.stringify(user), 1);
        
        if (user.role === "admin") {
          this.router.navigate(['/administrerEvents']);
        }
        else {
          this.router.navigate(['/mineEvents']);
        }
        this.appComponent.updateUser();
      },
      //Showing error message to the user depending on the http respons
        error => {
          if (error.status === 401) {
            this.model.password = "";
            this.wrongLogin = false;
            this.wrongPassword = true;
          }
          else if(error.status === 404)
            this.model.emailUsername = "";
            this.model.password = "";
            this.wrongPassword = false;
            this.wrongLogin = true;
        });
  }
}
