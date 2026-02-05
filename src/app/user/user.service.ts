import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

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

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/verify-email`, { token });
  }

  verifyUserOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/verify-otp`, { email, otp });
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
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
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
    // Use replaceUrl to prevent the user from going back to the protected page
    this.router.navigate(['/signin'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }
}
