import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CheckPoint } from '../models/check-point';
import { RacePoint } from '../models/race-point';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RacePointService {

  // private racepointUrl = 'https://oxbridgecloud.azurewebsites.net/racepoints/';

  private racepointUrl = 'http://localhost:3000//racepoints/';
  
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Sends a http get request to the backend, in order to get all racepoints
   * @param eventId - The id of the event
   */
  public getAllEventRacePoints(eventId: Number): Observable<RacePoint[]> {

    return this.http.get<RacePoint[]>(this.racepointUrl + "fromEventId/" + eventId)
      .pipe(map(racePoints => { return racePoints }));
  }

  /**
   * Sends a http get request to the backend, in order to get start and finish points
   * @param eventId - The id of the event
   */
  public getStartAndFinish(eventId): Observable<RacePoint[]>{
    return this.http.get<RacePoint[]>(this.racepointUrl+"findStartAndFinish/"+eventId).pipe(map(racePoints => { return racePoints }))
  }

  /**
   * Sends a http post request to the backend, in order to save a new route
   * @param racepoints - The racepoints of the route
   * @param eventId - The id of the event
   */
  public saveRoute(racepoints: RacePoint[], eventId:number): Observable<RacePoint[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.post<RacePoint[]>(this.racepointUrl+"createRoute/"+eventId, racepoints, httpOptions).pipe(map(racepoints => {return racepoints}));
  }
}
