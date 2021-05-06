import { Component, OnInit, NgModule } from '@angular/core';
import { Event } from 'src/app/models/Event';
import { Observable, combineLatest } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {

  events: Observable<Event[]>;
  filter: FormControl;
  filter$: Observable<string>;
  filteredEvents: Observable<Event[]>;

  constructor(private eventService: EventService) {
    this.events = this.eventService.getEvents();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));

    //Setting searchfilter
    this.filteredEvents = combineLatest(this.events, this.filter$)
      .pipe(map(([events, filterString]) => events.filter(event => event.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 || event.city.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)));
   }

  ngOnInit(): void {}

}
