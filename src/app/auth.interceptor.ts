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
        // Get the toke from localStorage
        const token = localStorage.getItem('token');

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
                    // Auto logout if 401/403 returned from API
                    localStorage.removeItem('token');
                    localStorage.removeItem('loggedInUser');

                    // Only redirect if not already on signin/signup page
                    const currentUrl = this.router.url;
                    if (!currentUrl.includes('/signin') && !currentUrl.includes('/signup')) {
                        this.router.navigate(['/signin']);
                    }
                }
                return throwError(error);
            })
        );
    }
}
