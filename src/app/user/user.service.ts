import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  checkIfEmailExists(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/check-email`, { gmailId: email });
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  loginUser(user: { email?: string; username?: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, user);
  }

  // Google Login via Firebase Token
  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/google-signin`, { idToken });
  }

  private loggedInUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('loggedInUser'));
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setLoggedInUser(username: string | null, token?: string) {
    if (username && token) {
      localStorage.setItem('loggedInUser', username);
      localStorage.setItem('token', token);
      this.loggedInUserSubject.next(username);
      this.isAuthenticatedSubject.next(true);
    } else {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');
      this.loggedInUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }

  getLoggedInUser(): string | null {
    return localStorage.getItem('loggedInUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  signOut(): void {
    this.setLoggedInUser(null);
    window.location.reload();
  }
}
