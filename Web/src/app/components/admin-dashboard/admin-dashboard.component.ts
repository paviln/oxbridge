import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { Event } from 'src/app/models/Event';
import { EventService } from 'src/app/services/event.service';
import { CookieService } from 'ngx-cookie-service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {

  events: Observable<Event[]>;
  filter: FormControl;
  filter$: Observable<string>;
  filteredEvents: Observable<Event[]>;

  model = new Event();

  constructor(private eventService: EventService) {
    this.setEvents();
  }

  ngOnInit(): void { }

  /**
   * Gets all events from the backend and sets the search filter
   */
  setEvents() {
    this.events = this.eventService.getEvents();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));

    this.filteredEvents = combineLatest(this.events, this.filter$)
      .pipe(map(([events, filterString]) => events.filter(event => event.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 || event.city.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
  }

  /**
   * Event handler for submitting a new event
   * @param form 
   */
  OnSubmit(form: NgForm) {
    this.eventService.AddEvent(this.model).pipe()
      .subscribe(eventReg => {
        this.setEvents();
        form.reset();
      },
        error => {
          console.log(error.status);
        });
  }
}
