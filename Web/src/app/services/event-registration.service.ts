import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EventRegistration } from '../models/event-registration';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationService {

  //  private eventRegistrationUrl = 'https://oxbridgecloud.azurewebsites.net/eventRegistrations/';

  private eventRegistrationUrl = 'http://localhost:3000/eventRegistrations/';

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  /**
   * Sends a http post request to the backend, in order to sign up for an event
   * @param shipId 
   * @param teamName 
   * @param eventCode 
   */
  public SignUpForEvent(shipId:number, teamName:string, eventCode:string): Observable<EventRegistration> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.post<EventRegistration>(this.eventRegistrationUrl+"signUp", {shipId, teamName, eventCode}, httpOptions).pipe(map(eventReg => { return eventReg}));
  }

  /**
   * Sends a http get request to the backend in order to get all participants of an event and returns the respons
   * @param eventId 
   */
  public getParticipants(eventId:Number): Observable<Participant[]>{
    return this.http.get<Participant[]>(this.eventRegistrationUrl+"getParticipants/"+eventId).pipe(map(participants => { return participants }))
  }

  /**
   * Sends a http post request to the backend, in order to add a participant to an event
   * @param participant 
   */
  public addParticipant(participant): Observable<Participant>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.post<Participant>(this.eventRegistrationUrl+"addParticipant", participant, httpOptions).pipe(map(participant => {return participant}));
  }

  /**
   * Sends a http put request to the backend, in order to update a participants information
   * @param participant 
   */
  public updateParticipant(participant): Observable<Participant>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.put<Participant>(this.eventRegistrationUrl+"updateParticipant/"+participant.eventRegId, participant, httpOptions).pipe(map(participant => {return participant}));
  }

  /**
   * Sends a http delete request to the backend, in order to delete an participant for an event
   * @param eventRegId 
   */
  public deleteParticipant(eventRegId): Observable<EventRegistration>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.delete<EventRegistration>(this.eventRegistrationUrl+eventRegId, httpOptions).pipe(map(eventRegistration => {return eventRegistration}));
  }

  public unSubscribeToEvent(eventRegId): Observable<EventRegistration>
  {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.delete<EventRegistration>(this.eventRegistrationUrl+eventRegId, httpOptions).pipe(map(eventReg => {return eventReg}));
  }
}
