import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationServiceService {


  private eventRegistrationUrl = environment.baseApiUrl+'eventRegistrations/';
  
  constructor(private cookieService: CookieService, private http: HttpClient) { }
}
