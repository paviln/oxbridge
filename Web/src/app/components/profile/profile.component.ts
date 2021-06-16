import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ship } from '../../models/ship';
import { User } from '../../models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ShipService } from '../../services/ship.service';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  ships: Observable<Ship[]>
  user: User;
  model = new Ship();
  form: FormGroup;
  submitted = false;
  loading = false;

  
  constructor(
    private cookieService: CookieService, 
    private http: HttpClient, 
    private shipService: ShipService, 
    private userService: UserService, 
    private appComponent: AppComponent,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setShips();
    this.user = JSON.parse(this.cookieService.get('user'));
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required, this.user.firstname]],
      lastname: ['', [Validators.required, this.user.lastname]],
      password: ['', [Validators.required, this.user.password]]
    }
      
    )};
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  
  /**
   * Getting all users ships
   */
  setShips() {
    this.ships = this.shipService.getMyShips();
  }

  /**
   * Event handler for deleting a ship
   * @param ship 
   */
  deleteShip(ship) {
    this.shipService.deleteShip(ship.shipId).subscribe(ship => this.setShips());
  }

  /**
   * Event handler for submitting changes to the user profile
   */
  OnSubmit() {

    this.submitted = true;
      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

    this.userService.updateUser(this.user).subscribe(res => {
      this.cookieService.set('user', JSON.stringify(this.user));
      this.appComponent.updateUser();
      alert("Dine nye oplysninger er nu gemt")
    }, error => {
      this.user = JSON.parse(this.cookieService.get('user'));
    });
  }

  /**
   * Event handler for submitting a new ship
   */
  OnShipSubmit() {
    this.shipService.addShip(this.model).subscribe(ship => this.setShips());
  }
}
