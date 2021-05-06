import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from 'src/app/models/event';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { MyEvents } from '../models/my-events';
import { EventRegistration } from '../models/event-registration';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // private eventsUrl = 'https://oxbridgecloud.azurewebsites.net/events/';

  private eventsUrl = 'http://localhost:3000/events/';
  
  constructor(private http: HttpClient, private cookieService:CookieService) { }

  /**
   * Sends a http get event to the backend, in order to retrieve all events
   */
  public getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        catchError(this.handleError<Event[]>('getEvents', []))
      );
  }

  /**
   * Sends a http get request to the backend, in order to retrieve an specific event
   * @param eventId - The id of the event
   */
  public getEvent(eventId:Number): Observable<Event> {
    return this.http.get<Event>(this.eventsUrl+eventId)
      .pipe(map(event => { return event}));
  }

  /**
   * Sends a http get request to the backend, in order to retrieve all events, that the user is a participant of
   */
  public getMyEvents(): Observable<MyEvents[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    console.log("user token: "+user.token);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.get<MyEvents[]>(this.eventsUrl+"myEvents/findFromUsername", httpOptions)
      .pipe(map(events => { return events }));
  }

  /**
   * Sends a http post request to the backend, in order to create a new event
   * @param event - the new event
   */
  public AddEvent(event: Event): Observable<Event> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    
    event.eventStart = event.eventStart+"T"+event.eventStartTime+":00.000+00:00";
    event.eventEnd = event.eventEnd+"T"+event.eventEndTime+":00.000+00:00";

    return this.http.post<Event>(this.eventsUrl, event, httpOptions).pipe(map(event => { return event }));
  }

  /**
   * Sends a http put request to the backend, in order to update an event  
   * @param event - The new event information
   * @param eventId - The id of the event
   */
  public updateEvent(event, eventId): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.put(this.eventsUrl+eventId, event, httpOptions).pipe(map(event => {return event}));
  }

  /**
   * Sends a http delete request to the backend, in order to delete an event
   * @param eventId - The id of the event
   */
  public deleteEvent(eventId): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.delete(this.eventsUrl+eventId, httpOptions).pipe(map(event => {return event}));
  }

  /**
   * Sends a http get request to the backend, in order to check if the event has a route
   * @param eventId - The id of the event
   */
  public hasRoute(eventId: Number): Observable<boolean>{
    return this.http.get<boolean>(this.eventsUrl+"hasRoute/"+eventId).pipe(map(res => { return res }))
  }

  /**
   * Sends a http put request to the backend, in order to start an event
   * @param eventId - The id of the event
   */
  public startEvent(eventId): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    let dateTimeNow = new Date(Date.now());
    dateTimeNow.setHours(dateTimeNow.getHours()+2);
    return this.http.put<Event>(this.eventsUrl+"startEvent/"+eventId, {actualEventStart: dateTimeNow.toUTCString()}, httpOptions).pipe(map(event => { return event }));
  }

  /**
   * Sends a http get request to the backend, in order to stop an event
   * @param eventId - The id of the event
   */
  public stopEvent(eventId): Observable<Event>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.get<Event>(this.eventsUrl+"stopEvent/"+eventId, httpOptions).pipe(map(event => {return event}));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return null;
    };
  }

}
