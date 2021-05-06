import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { switchMap, tap, startWith, map } from 'rxjs/operators';
import { Event } from '../../models/event';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Participant } from 'src/app/models/participant';
import { EventRegistrationService } from 'src/app/services/event-registration.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.css']
})
export class AdminEventComponent implements OnInit {

  event: Observable<Event>;
  eventId: string;

  participants: Observable<Participant[]>;
  filter: FormControl;
  filter$: Observable<string>;
  filteredParticipants: Observable<Participant[]>;

  eventForm: FormGroup;
  model: Participant;

  buttonText: String;
  hasRoute: Observable<boolean>;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private eventService: EventService, private eventRegService: EventRegistrationService, private router: Router) {
  }

  ngOnInit(): void {

    //Initializing the formgroup
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
      eventStart: ['', Validators.required],
      eventEnd: ['', Validators.required],
      city: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });

    this.setEvent();
    this.setParticipants();

    this.event.subscribe(event => {
      this.eventId = event.eventId
      this.model = new Participant("", "", "", "", "", event.eventId, "")
    });

    //Checks if the event has a route or not
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return this.eventService.hasRoute(parseInt(params.get('eventId')))
    })).subscribe(hasRoute => {
      if (hasRoute)
        this.buttonText = "Se Rute";
      else
        this.buttonText = "Planlæg rute";
    })
  }

  /**
   * Gets the participants of the event and initialize the search filter
   */
  setParticipants() {
    this.participants = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.eventRegService.getParticipants(parseInt(params.get('eventId'))))
    )

    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));

    this.filteredParticipants = combineLatest(this.participants, this.filter$)
      .pipe(map(([participants, filterString]) => participants.filter(participant =>
        participant.firstname.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
        participant.lastname.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
        participant.shipName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
        participant.teamName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1 ||
        participant.emailUsername.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
      )));
  }

  /**
   * Filling the FormGroup with the event information
   */
  setEvent() {
    this.event = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.eventService.getEvent(parseInt(params.get('eventId'))).pipe(tap(event => {
          this.eventForm.patchValue(event);

          //Formatting the dates and times
          this.eventForm.controls['eventStart'].setValue(formatDate(event.eventStart, 'yyyy-MM-dd', 'en'));
          this.eventForm.controls['eventEnd'].setValue(formatDate(event.eventEnd, 'yyyy-MM-dd', 'en'));

          let startTime = new Date(event.eventStart);
          startTime.setUTCHours(startTime.getUTCHours() - 2);
          this.eventForm.controls['startTime'].setValue(formatDate(startTime, 'HH:mm', 'en'));

          let endTime = new Date(event.eventEnd);
          endTime.setUTCHours(endTime.getUTCHours() - 2);
          this.eventForm.controls['endTime'].setValue(formatDate(endTime, 'HH:mm', 'en'));
        })))
    );
  }

  /**
   * Event handler for submitting changes to the event information
   */
  onEventSubmit() {
    let newEvent = new Event();
    newEvent.eventStart = this.eventForm.controls['eventStart'].value + "T" + this.eventForm.controls['startTime'].value + ":00.000+00:00";
    newEvent.eventEnd = this.eventForm.controls['eventEnd'].value + "T" + this.eventForm.controls['endTime'].value + ":00.000+00:00";
    newEvent.name = this.eventForm.controls['name'].value;
    newEvent.city = this.eventForm.controls['city'].value;

    this.event.subscribe(event => {
      newEvent.eventId = event.eventId;
      this.eventService.updateEvent(newEvent, newEvent.eventId).subscribe(event => {
        alert("De nye eventinformationer er gemt");
        this.setEvent();
      },
        error => {
          console.log(error);
        });
    });
  }

  /**
   * Event handler for submitting a new participant to the event
   * @param form 
   */
  onSubmit(form: NgForm) {
    this.eventRegService.addParticipant(this.model).pipe()
      .subscribe(participant => {
        this.setParticipants();
        form.reset();
      },
        error => {
          console.log(error.status);
        });
  }

  /**
   * Event handler for submitting changes to a given participants information
   * @param participant 
   */
  editParticipant(participant) {
    this.eventRegService.updateParticipant(participant).subscribe(participant => {
      alert("Deltagerens nye informationer er gemt");
      this.setParticipants();
    }, error => {
      console.log(error.status);
    });
  }

  /**
   * Event handler for deleting a given participant from the event
   * @param participant 
   */
  deleteParticipant(participant) {
    this.eventRegService.deleteParticipant(participant.eventRegId).subscribe(participant => {
      this.setParticipants();
    }, error => {
      console.log(error.status);
    });
  }

  /**
   * Event handler for deleting the whole event
   */
  deleteEvent() {
    this.eventService.deleteEvent(this.eventId).subscribe(event => {
      this.router.navigateByUrl('/administrerEvents');
    }, error => {
      console.log(error.status);
    })
  }

  /**
   * Event handler for starting an event
   */
  startEvent() {
    this.eventService.startEvent(this.eventId).subscribe(event => {
      this.setEvent();
    }, error => {
      console.log(error);
    });
  }

  /**
   * Event handler for stopping an event
   */
  stopEvent() {
    this.eventService.stopEvent(this.eventId).subscribe(event => {
      this.setEvent();
    }, error => {
      console.log(error)
    })
  }
}
