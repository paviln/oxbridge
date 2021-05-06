import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { startWith, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { MyEvents } from 'src/app/models/my-events';
import { EventSignUp } from 'src/app/models/event-sign-up';
import { Ship } from 'src/app/models/ship';
import { ShipService } from 'src/app/services/ship.service';
import { EventRegistrationService } from 'src/app/services/event-registration.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  events: Observable<MyEvents[]>;
  filter: FormControl;
  filter$: Observable<string>;
  filteredEvents: Observable<MyEvents[]>;

  ships: Observable<Ship[]>;
  model = new EventSignUp("", "");
  alreadySignedUp:boolean = false;
  WrongEventCode:boolean = false;

  constructor(private eventService: EventService, private eventRegService: EventRegistrationService, private shipService: ShipService, private cookieService:CookieService) {
    this.setMyEvents();
   }

  ngOnInit(): void {
  }

  /**
   * Get all the events the user is a participant of and initialize the search function
   */
  setMyEvents()
  {
    this.events = this.eventService.getMyEvents();
    this.ships = this.shipService.getMyShips(); 
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));

    this.filteredEvents = combineLatest(this.events, this.filter$)
      .pipe(map(([events, filterString]) => events.filter(event => event.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 || event.city.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 || event.teamName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 || event.shipName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
  }

  /**
   * Event handler for submitting as a participant to an event
   * @param form 
   */
  OnSubmit(form: NgForm)
  {
    this.eventRegService.SignUpForEvent(this.model.ship.shipId, this.model.teamName, this.model.eventCode).pipe()
    .subscribe(eventReg => {
      this.setMyEvents();
      form.reset();
      this.WrongEventCode = false;
      this.alreadySignedUp = false;
    }, 
    error => {
      if(error.status === 409)
      {
        console.log("error message: "+error.message);
        this.model.eventCode = "";
        this.WrongEventCode = false;
        this.alreadySignedUp = true;
      }
      else if(error.status === 404)
      {
        console.log("error message: "+error.statusText+error.url);
        this.alreadySignedUp = false;
        this.WrongEventCode = true;
      }
    });
  }

  /**
   * Event handler for unsubmitting as participant to an event
   * @param event 
   */
  unSubToEvent(event){
    console.log("delete eventReg called")
    this.eventRegService.deleteParticipant(event.eventRegId).subscribe(eventReg => {
      this.setMyEvents();
    }, error => {
      console.log(error.status);
    });
  }
}
