import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../models/score';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationRegistrationService {

  private locationRegUrl = "http://localhost:3000/locationRegistrations/";

  //private locationRegUrl = "https://oxbridgecloud.azurewebsites.net/locationRegistrations/";
  constructor(private http: HttpClient) { }

  /**
   * Sends a http get request to the backend, in order to get the latest standings in a race
   * @param eventId - The id of the event
   */
  public getLive(eventId): Observable<Score[]>
  {
    return this.http.get<Score[]>(this.locationRegUrl+"getLive/"+eventId).pipe(map(score => { return score}));
  }

  /**
   * Sends a http get request to the backend, in order to get the final scores
   * @param eventId - The id of the event
   */
  public getScoreboard(eventId): Observable<Score[]>
  {
    return this.http.get<Score[]>(this.locationRegUrl+"getScoreboard/"+eventId).pipe(map(score => {return score}));
  }
}
