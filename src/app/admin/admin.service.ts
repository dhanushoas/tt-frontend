import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Admin } from './admin';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  checkIfEmailExists(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/check-email`, { gmailId: email });
  }

  registerAdmin(admin: Admin): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/register`, admin).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  loginAdmin(admin: { adminname: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/login`, admin);
  }

  private loggedInAdminnameSubject = new BehaviorSubject<string | null>(null);
  loggedInAdminname$ = this.loggedInAdminnameSubject.asObservable();

  setLoggedInAdmin(adminname: string | null) {
    this.loggedInAdminnameSubject.next(adminname);
    if (adminname !== null) {
      localStorage.setItem('loggedInAdminname', adminname);
    } else {
      localStorage.removeItem('loggedInAdminname');
    }
  }

  getLoggedInAdmin(): string | null {
    return localStorage.getItem('loggedInAdminname');
  }

  signOut(): void {
    // Reset authentication state when signing out
    this.setLoggedInAdmin(null);
    this.authenticateAdmin(false);
  }

  private isLoggedInFlag: boolean = false; // Track admin authentication status

  // Method to check if the admin is logged in
  isLoggedIn(): boolean {
    return this.isLoggedInFlag;
  }

  // Method to authenticate admin (e.g., called after successful sign-in)
  authenticateAdmin(isLoggedIn: boolean): void {
    this.isLoggedInFlag = isLoggedIn;
  }
}
