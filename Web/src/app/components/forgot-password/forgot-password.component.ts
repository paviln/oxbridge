import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private userService: UserService,
      private alertService: AlertService
  ) { }

  ngOnInit() {
      this.form = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;


      this.alertService.clear();
      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.alertService.clear();
      this.userService.forgotPassword(this.f.email.value)
          .pipe(first())
          .pipe(finalize(() => this.loading = false))
          .subscribe({ 
          next: () => this.alertService.success('Tjek din email for password reset instruktioner'),
          error: error => this.alertService.error(error)
        });
          
  }
}
