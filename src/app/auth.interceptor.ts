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
        // Get the token from localStorage (prefer adminToken for admin routes)
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // Only redirect if it's an admin-related route
                if (error.status === 401 || error.status === 403) {
                    const currentUrl = this.router.url;

                    if (currentUrl.startsWith('/admin') || localStorage.getItem('adminToken')) {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('loggedInAdminname');
                        if (!currentUrl.includes('/admin-signin')) {
                            this.router.navigate(['/admin-signin']);
                        }
                    } else {
                        // For regular users, we just clear the potentially expired token
                        // but don't redirect because we've removed the signin requirement
                        localStorage.removeItem('token');
                        localStorage.removeItem('loggedInUser');
                    }
                }
                return throwError(error);
            })
        );
    }
}
