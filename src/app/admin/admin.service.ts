import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Admin } from './admin';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

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

  private loggedInAdminnameSubject = new BehaviorSubject<string | null>(localStorage.getItem('loggedInAdminname'));
  loggedInAdminname$ = this.loggedInAdminnameSubject.asObservable();

  private isAdminAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('adminToken'));
  isAdminAuthenticated$ = this.isAdminAuthenticatedSubject.asObservable();

  setLoggedInAdmin(adminname: string | null, token?: string) {
    if (adminname && token) {
      localStorage.setItem('loggedInAdminname', adminname);
      localStorage.setItem('adminToken', token);
      this.loggedInAdminnameSubject.next(adminname);
      this.isAdminAuthenticatedSubject.next(true);
    } else {
      localStorage.removeItem('loggedInAdminname');
      localStorage.removeItem('adminToken');
      this.loggedInAdminnameSubject.next(null);
      this.isAdminAuthenticatedSubject.next(false);
    }
  }

  getLoggedInAdmin(): string | null {
    return localStorage.getItem('loggedInAdminname');
  }

  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  signOut(): void {
    this.setLoggedInAdmin(null);
    this.router.navigate(['/admin-signin'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  // Backwards compatibility for now
  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  authenticateAdmin(isLoggedIn: boolean): void {
    this.isAdminAuthenticatedSubject.next(isLoggedIn);
  }
}
