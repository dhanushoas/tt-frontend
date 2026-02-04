import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Get the token from localStorage (prefer adminToken if present, else user token)
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

        if (token) {
            // Clone the request and add the Authorization header
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    const currentUrl = this.router.url;

                    if (localStorage.getItem('adminToken')) {
                        // Admin logout
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('loggedInAdminname');
                        if (!currentUrl.includes('/admin-signin')) {
                            this.router.navigate(['/admin-signin']);
                        }
                    } else {
                        // User logout
                        localStorage.removeItem('token');
                        localStorage.removeItem('loggedInUser');
                        if (!currentUrl.includes('/signin') && !currentUrl.includes('/signup')) {
                            this.router.navigate(['/signin']);
                        }
                    }
                }
                return throwError(error);
            })
        );
    }
}
