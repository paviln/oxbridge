import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ship } from 'src/app/models/ship';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ShipService } from 'src/app/services/ship.service';
import { UserService } from 'src/app/services/user.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  ships: Observable<Ship[]>
  user: User;
  model = new Ship();

  constructor(private cookieService: CookieService, private http: HttpClient, private shipService: ShipService, private userService: UserService, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.setShips();
    this.user = JSON.parse(this.cookieService.get('user'));
  }

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
