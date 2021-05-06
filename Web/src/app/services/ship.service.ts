import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Ship } from '../models/ship';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShipService {

  // private shipUrl = 'https://oxbridgecloud.azurewebsites.net/ships/'

  private shipUrl = 'http://localhost:3000/ships/'
  constructor(private http: HttpClient, private cookieService:CookieService) { }

  /**
   * Sends a http get request to the backend, in order to get all users ships
   */
  public getMyShips(): Observable<Ship[]> {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.get<Ship[]>(this.shipUrl+"myShips/fromUsername", httpOptions)
      .pipe(map(ships => { return ships }));
  }

  /**
   * Sends a http delete request to the backend, in order to delete a ship
   * @param shipId - The id of the ship
   */
  public deleteShip(shipId): Observable<Ship>{
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.delete<Ship>(this.shipUrl+shipId, httpOptions)
      .pipe(map(ship => { return ship }));
  }

  /**
   * Sends a http post request to the backend, in order to add a ship
   * @param newShip - The new ship to be added
   */
  public addShip(newShip: Ship): Observable<Ship>
  {
    let user = JSON.parse(this.cookieService.get('user'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': user.token
      })
    }
    return this.http.post<Ship>(this.shipUrl, newShip, httpOptions).pipe(map(ship => { return ship }));
  }
}
