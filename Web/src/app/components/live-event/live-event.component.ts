import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, startWith, race } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';
import { RacePointService } from 'src/app/services/race-point.service';
import { Observable, interval } from 'rxjs';
import { Score } from 'src/app/models/score';
import { LocationRegistrationService } from 'src/app/services/location-registration.service';

@Component({
  selector: 'app-live-event',
  templateUrl: './live-event.component.html',
  styleUrls: ['./live-event.component.css']
})
export class LiveEventComponent implements OnInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions;
  coordinates;
  markers = [];
  boatMarkers = [];

  timer: any;

  event: Event;
  scoreboard: Observable<Score[]>;

  constructor(private route: ActivatedRoute, private eventService: EventService, private racePointService: RacePointService, private locationRegService: LocationRegistrationService) {
    this.coordinates = new google.maps.LatLng(54.982711, 9.775667);
    this.mapOptions = {
      center: this.coordinates,
      zoom: 11
    };
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.eventService.getEvent(parseInt(params.get('eventId'))).pipe(event => { return event }))).subscribe(event => { this.event = event });
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  /**
   * Initializing the map with start- and finishline
   */
  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return this.racePointService.getStartAndFinish(parseInt(params.get('eventId'))).pipe(racePoints => { return racePoints })
    })).subscribe(racePoints => {
      console.log("racepoints lenght" + racePoints.length)
      this.placeMarker(new google.maps.LatLng(racePoints[0].firstLatitude, racePoints[0].firstLongtitude), '../assets/images/startline.png');
      this.placeMarker(new google.maps.LatLng(racePoints[0].secondLatitude, racePoints[0].secondLongtitude), '../assets/images/startline.png');

      this.placeMarker(new google.maps.LatLng(racePoints[racePoints.length - 1].firstLatitude, racePoints[racePoints.length - 1].firstLongtitude), '../assets/images/finishflag.png');
      this.placeMarker(new google.maps.LatLng(racePoints[racePoints.length - 1].secondLatitude, racePoints[racePoints.length - 1].secondLongtitude), '../assets/images/finishflag.png');

      this.map.setCenter(new google.maps.LatLng(racePoints[0].firstLatitude, racePoints[0].firstLongtitude));
      this.initializeBoatTracking();
    })
  }

  /**
   * Place the given marker on the map
   * @param latLng Latitude and longitude of the marker
   * @param url The image url for the marker
   */
  placeMarker(latLng, url) {

    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: url
    })

    this.markers.push(marker);

    if (this.markers.length % 2 === 0) {
      let marker1 = this.markers[this.markers.length - 2];
      let marker2 = this.markers[this.markers.length - 1];
      var polyline = this.setPolyline(marker1, marker2);
    }
    marker.setMap(this.map);
  }

  /**
   * Place a polyline between the two given markers
   * @param marker1 
   * @param marker2 
   */
  setPolyline(marker1, marker2) {
    var lineCoordinates = [marker1.position, marker2.position]
    var line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    line.setMap(this.map);
  }

  /**
   * Calling the backend every 1 second to get ship positions
   */
  initializeBoatTracking() {
    this.timer = setInterval(() => {
      this.locationRegService.getLive(this.event.eventId).subscribe(scores => {
        this.setBoatMarkers(scores);
        return scores;
      }, error => {

      });
    }, 1000);
  }

  /**
   * Setting or moving the the ship markers to the new given positions
   * @param scores 
   */
  setBoatMarkers(scores: Score[]) {

    this.scoreboard = new Observable<Score[]>((observer) => {
      observer.next(scores);
    });

    if (this.boatMarkers === null || this.boatMarkers.length === 0) {
      scores.forEach(score => {
        let boat = new google.maps.Marker({
          position: new google.maps.LatLng(score.locationsRegistrations[0].latitude, score.locationsRegistrations[0].longtitude),
          map: this.map,
          icon: '../assets/images/boatIcon.png',
          label: {
            text: score.placement.toString(),
            color: score.color
          }
        })
        boat.setMap(this.map);
        boat.setTitle(score.shipId.toString() + " " + score.teamName);
        this.boatMarkers.push(boat);
      });
    }
    else {
      this.boatMarkers.forEach(boat => {
        let index = scores.map(function (e) { return e.shipId }).indexOf(parseInt(boat.getTitle()));
        boat.setLabel({text: scores[index].placement.toString(), color: scores[index].color})
        boat.setPosition(new google.maps.LatLng(scores[index].locationsRegistrations[0].latitude, scores[index].locationsRegistrations[0].longtitude));
      })
    }
  }

  /**
   * Stopping the interval calls to the backend
   */
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}


