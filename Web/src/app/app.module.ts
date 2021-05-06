import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EventsComponent } from './components/events/events.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { EventComponent } from './components/event/event.component';
import { ValidateEqualModule } from 'ng-validate-equal';
import { AuthGuard } from './guards/auth.guard';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminEventComponent } from './components/admin-event/admin-event.component';
import { RutePlannerComponent } from './components/rute-planner/rute-planner.component';
import { LiveEventComponent } from './components/live-event/live-event.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    RegistrationComponent,
    PageNotFoundComponent,
    EventsComponent,
    LoginComponent,
    EventComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    ProfileComponent,
    AdminEventComponent,
    RutePlannerComponent,
    LiveEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ValidateEqualModule,
    NgbModule
  ],
  providers: [AuthGuard, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
