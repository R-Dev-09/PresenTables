import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, AuthResponseData } from '../shared/user.model';
import { Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuth = false;
  private authListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  private userEmail: string;
  user = new Subject<User>();
  emailListener = new Subject<string>();

  constructor(private http: HttpClient, private _snackbar: MatSnackBar) { }

  onLogin(email: string, password: string) {
    this.userEmail = email;
    const user = {email, password};
    return this.http.post<AuthResponseData>(`auth/login`, user).pipe(
      catchError(this.handleError.bind(this)),
      tap(res => {
        this.userEmail = res.email;
        this.emailListener.next(res.email);
        this.handleAuth(res.email, res.userId, res.access_token, +res.expiresIn);
    }));
  }

  onSignup(email: string, password: string) {
    this.userEmail = email;
    const user = {email, password};
    return this.http.post<AuthResponseData>(`auth/signup`, user).pipe(
      catchError(this.handleError.bind(this)), 
      tap(res => {
        this.userEmail = res.email;
        this.emailListener.next(res.email);
        this.handleAuth(res.email, res.userId, res.access_token, +res.expiresIn);
        this.openSnackBar('Welcome!');
    }));
  }

  getToken() {
    return this.token;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }

  getEmailListener() {
    return this.emailListener.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }

  onLogout() {
    this.token = null;
    this.isAuth = false;
    this.userId = null;
    this.userEmail = null;
    this.authListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userEmail = authInformation.email;
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authListener.next(true);
      this.emailListener.next(authInformation.email);
    }
  }

  private openSnackBar(message: string) {
    this._snackbar.open(message, 'OK', {
      duration: 5000
    });
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }

  private saveAuthData(email: string, token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    if (!token || !expirationDate) {
      return;
    }
    return {email, token, expirationDate: new Date(expirationDate), userId};
  }

  private handleAuth(email: string, userId: string, access_token: string, expiresIn: number) {
    const token = access_token;
    this.token = token;
    if (token) {
      this.isAuth = true;
      this.authListener.next(true);
      const expiresInDuration = expiresIn;
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
      this.saveAuthData(email, token, expirationDate, this.userId);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.status === 0) {
      this.openSnackBar('Authentication failed: server offline');
      return throwError(errorRes.message);
    }
    this.openSnackBar(errorRes.error.message)
    this.isAuth = false;
    this.authListener.next(false);
    return throwError(errorRes.error.message);
  }
}
