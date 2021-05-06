import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EventsComponent } from './components/events/events.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { EventComponent } from './components/event/event.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminEventComponent } from './components/admin-event/admin-event.component';
import { RutePlannerComponent } from './components/rute-planner/rute-planner.component';
import { LiveEventComponent } from './components/live-event/live-event.component';

const routes: Routes = [
  { path: 'hjem', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'omos', component: AboutComponent },
  { path: 'tilmelding', component: RegistrationComponent },
  { path: 'logind', component: LoginComponent },
  { path: 'mineEvents', component: UserDashboardComponent, canActivate: [AuthGuard], data: {expectedRole: 'user' }},
  { path: 'administrerEvents', component: AdminDashboardComponent, canActivate: [AuthGuard], data: {expectedRole: 'admin' }},
  { path: 'events/:eventId/:name', component: EventComponent },
  { path: 'events/:eventId/:name/live', component: LiveEventComponent},
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'user' }},
  { path: 'administrerEvent/:eventId/:name', component: AdminEventComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' }},
  { path: 'administrerEvent/:eventId/:name/ruteplanner', component: RutePlannerComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' }},
  { path: '', redirectTo:'/hjem', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
