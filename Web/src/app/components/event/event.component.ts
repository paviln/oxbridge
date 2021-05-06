import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Event } from '../../models/event';
import { Score } from '../../models/score';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RacePointService } from 'src/app/services/race-point.service';
import { LocationRegistrationService } from 'src/app/services/location-registration.service';
import { EventRegistrationService } from 'src/app/services/event-registration.service';
import { Participant } from 'src/app/models/participant';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  event: Observable<Event>;
  scoreboard: Observable<Score[]>;
  participants: Observable<Participant[]>;
  hasRoute = false;
  raceIsOver: boolean;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  coordinates;
  mapOptions: google.maps.MapOptions;
  markers = []

  constructor(private eventRegService: EventRegistrationService, private locationRegService: LocationRegistrationService, private route: ActivatedRoute, private eventService: EventService, private racePointService: RacePointService) { }

  ngOnInit(): void {
    this.event = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.eventService.getEvent(parseInt(params.get('eventId'))))
    );

    //Showing event info depending on the event state
    this.event.subscribe(event => {
      if (event.isLive || event.actualEventStart === undefined) {
        this.raceIsOver = false;
        this.setParticipants(event);
      }
      else {
        this.raceIsOver = true;
        this.setScoreboard(event);
      }
    })
  }

  ngAfterViewInit() {

    //Setting the map if the event has a route planned
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return this.eventService.hasRoute(parseInt(params.get('eventId')))
    })).subscribe(route => {
      if (route) {
        this.hasRoute = true;
        this.mapInitializer();
      }
      else
        this.hasRoute = false;
    })
  }

  /**
   * Initializing the map and setting event checkpoints
   */
  mapInitializer() {
    this.coordinates = new google.maps.LatLng(54.982711, 9.775667);
    this.mapOptions = {
      center: this.coordinates,
      zoom: 11
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return this.racePointService.getAllEventRacePoints(parseInt(params.get('eventId'))).pipe(racePoints => { return racePoints })
    })).subscribe(racePoints => {
      racePoints.forEach(racePoint => {
        this.placeMarker(new google.maps.LatLng(racePoint.firstLatitude, racePoint.firstLongtitude), racePoint.type);
        this.placeMarker(new google.maps.LatLng(racePoint.secondLatitude, racePoint.secondLongtitude), racePoint.type);
      })
      this.map.setCenter(this.markers[0].position);
    });
  }

  /**
   * Placing a marker on the map
   * @param latLng The latitude and longitude og the marker
   * @param type the type of marker
   */
  placeMarker(latLng, type) {

    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    })

    if (type === "finishLine") {
      marker.setIcon('../assets/images/finishflag.png');
    }
    else if (type === "startLine") {
      marker.setIcon('../assets/images/startline.png')
    }
    this.markers.push(marker);

    if (this.markers.length % 2 === 0) {
      let marker1 = this.markers[this.markers.length - 2];
      let marker2 = this.markers[this.markers.length - 1];
      this.setPolyline(marker1, marker2);
    }
    marker.setMap(this.map);
  }

  /**
   * Sets a polyline between the two given markers
   * @param marker1 
   * @param marker2 
   */
  setPolyline(marker1, marker2) {
    var lineCoordinates = [marker1.position, marker2.position]
    var line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    line.setMap(this.map);
    return line;
  }

  /**
   * Get all the participants for the event
   * @param event 
   */
  setParticipants(event) {
    this.participants = this.eventRegService.getParticipants(event.eventId);
  }

  /**
   * Get the scoreboard for the event
   * @param event
   */
  setScoreboard(event) {
    this.scoreboard = this.locationRegService.getScoreboard(event.eventId);
  }
}
