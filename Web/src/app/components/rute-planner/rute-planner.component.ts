import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CheckPoint } from 'src/app/models/check-point';
import { Event } from '../../models/event';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';
import { RacePointService } from 'src/app/services/race-point.service';
import { RacePoint } from 'src/app/models/race-point';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rute-planner',
  templateUrl: './rute-planner.component.html',
  styleUrls: ['./rute-planner.component.css']
})
export class RutePlannerComponent implements OnInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;

  event: Event;
  coordinates;
  markers = [];
  polylines = [];
  checkPoints = [];
  racePoints: RacePoint[];
  secondMarker = false;
  mapOptions: google.maps.MapOptions;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.eventService.getEvent(parseInt(params.get('eventId'))).pipe(event => { return event }))).subscribe(event => { this.event = event });
  }

  constructor(private route: ActivatedRoute, private eventService: EventService, private racePointService: RacePointService, private location: Location) {
    this.coordinates = new google.maps.LatLng(54.982711, 9.775667);
    this.mapOptions = {
      center: this.coordinates,
      zoom: 10
    };
  }

  /**
   * Placing a marker on the map
   * @param latLng Latitude and Longitude of the marker
   * @param type the type of marker
   */
  placeMarker(latLng) {

    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    })

    if (this.markers.length === 0 || this.markers.length === 1) {
      marker.setIcon('../assets/images/startline.png');
    }
    else {
      if (this.markers.length > 3)
        this.markers[this.markers.length - 2].setIcon('../assets/images/MapPin.png');
      marker.setIcon('../assets/images/finishflag.png')
    }

    this.markers.push(marker);

    if (this.markers.length % 2 === 0) {
      let marker1 = this.markers[this.markers.length - 2];
      let marker2 = this.markers[this.markers.length - 1];
      var polyline = this.setPolyline(marker1, marker2);
      this.setCheckpoint(marker1, marker2, polyline);
    }
    marker.setMap(this.map);
  }

  /**
   * Sets a polyline between the two given markers
   * @param marker1 
   * @param marker2 
   */
  setPolyline(marker1, marker2): google.maps.Polyline {
    var lineCoordinates = [marker1.position, marker2.position]
    var line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.polylines.push(line);
    line.setMap(this.map);
    return line;
  }

  /**
   * Saving the two given markers and polyline as a checkpoint
   * @param marker1 
   * @param marker2 
   * @param polyline 
   */
  setCheckpoint(marker1, marker2, polyline) {
    this.checkPoints.push(new CheckPoint(this.checkPoints.length + 1, marker1, marker2, polyline));
  }


  ngAfterViewInit() {
    this.mapInitializer();

    //Setting the already planned event markers 
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return this.racePointService.getAllEventRacePoints(parseInt(params.get('eventId'))).pipe(racePoints => { return racePoints })
    })).subscribe(racePoints => {
      racePoints.forEach(racePoint => {
        this.placeMarker(new google.maps.LatLng(racePoint.firstLatitude, racePoint.firstLongtitude));
        this.placeMarker(new google.maps.LatLng(racePoint.secondLatitude, racePoint.secondLongtitude));
      })
      this.map.setCenter(this.markers[0].position);
    });
  }

  /**
   * Initializing the map
   */
  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.map.addListener('click', (event) => {
      this.placeMarker(event.latLng);
    });
  }

  /**
   * Deleting the given checkpoint
   * @param checkPointChoosen 
   */
  deleteCheckPoint(checkPointChoosen) {

    this.checkPoints.forEach(checkPoint => {
      if (this.checkPoints.indexOf(checkPointChoosen) < this.checkPoints.indexOf(checkPoint)) {
        checkPoint.id = checkPoint.id - 1;
      }
    })
    this.deleteCheckPointMarkers(checkPointChoosen)

    this.checkPoints.splice(this.checkPoints.indexOf(checkPointChoosen), 1);
  }

  /**
   * Removing the given checkpoints markers and polyline
   * @param checkPoint 
   */
  deleteCheckPointMarkers(checkPoint) {
    if (this.markers.length - 2 === this.markers.indexOf(checkPoint.pin1) && this.markers.indexOf(checkPoint.pin1) !== 2) {
      this.markers[this.markers.length - 4].setIcon('../assets/images/finishflag.png');
      this.markers[this.markers.length - 3].setIcon('../assets/images/finishflag.png');
    }

    checkPoint.pin1.setMap(null);
    checkPoint.pin2.setMap(null);
    checkPoint.polyline.setMap(null);

    this.markers.splice(this.markers.indexOf(checkPoint.pin1), 2);
    this.polylines.splice(this.polylines.indexOf(checkPoint.polyline), 1);
  }

  /**
   * Saving the checkpoints in the backend
   */
  saveRoute() {
    this.racePoints = [];
    this.checkPoints.forEach(checkpoint => {
      let newRacePoint = new RacePoint(checkpoint.pin1.getPosition().lng(), checkpoint.pin1.getPosition().lat(), checkpoint.pin2.getPosition().lng(), checkpoint.pin2.getPosition().lat(), parseInt(this.event.eventId), this.racePoints.length + 1);
      if (checkpoint.id === 1)
        newRacePoint.type = "startLine";
      else if (checkpoint.id === this.checkPoints.length)
        newRacePoint.type = "finishLine";
      else
        newRacePoint.type = "checkpoint";

      this.racePoints.push(newRacePoint);
    });

    this.racePointService.saveRoute(this.racePoints, parseInt(this.event.eventId)).pipe().subscribe(racepoints => {
      this.location.back();
    },
      error => {
        console.log(error);
      });
  }
}
