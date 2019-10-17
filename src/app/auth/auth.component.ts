import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authForm: FormGroup;
  showPW = false;
  isLoadingL = false;
  isLoadingS = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onAuth(mode: string) {
    const email = this.authForm.get('email').value;
    const password = this.authForm.get('password').value;
    if (mode === 'signup') {
      this.isLoadingS = true;
      this.authService.onSignup(email, password).subscribe(res => {
        this.isLoadingS = false;
      }, error => {
        this.isLoadingS = false;
      });
    } else {
      this.isLoadingL = true
      this.authService.onLogin(email, password).subscribe(res => {
        this.isLoadingL = false;
      }, error => {
        this.isLoadingL = false;
      });
    }
  }

  getErrorMessage(control: string) {
    switch (control) {
      case 'email':
        return this.authForm.get('email').hasError('required') ? 'Value is required' : 
          this.authForm.get('email').hasError('email') ? 'Invalid email address' : '';
      case 'password':
        return this.authForm.get('password').hasError('required') ? 'Value is required' :
          this.authForm.get('password').hasError('minlength') ? 'Password must be at least 6 characters' : '';
      default:
        return '';
    }
  }
}
