import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public model: User;
  public isAvaliable: boolean = true;

  constructor(private userService: UserService, private router: Router, private cookieService: CookieService, private appComponent: AppComponent) {
    this.model = new User();
  }

  /**
   * Event handler for submitting as new user
   */
  OnSubmit() {
    this.userService.registerUser(this.model).pipe(first())
      .subscribe(user => {
        this.model.role = "user";
        this.cookieService.set('user', JSON.stringify(this.model), 1);
        this.router.navigateByUrl('/mineEvents');
        this.appComponent.updateUser();
      },
        error => {
          if (error.status === 409) {
            this.model.emailUsername = "";
            this.isAvaliable = false;
          }
        });
  }

  ngOnInit(): void {
  }
}
