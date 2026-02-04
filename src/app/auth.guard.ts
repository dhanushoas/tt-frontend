import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('Auth Guard - Checking access to:', state.url);
  console.log('Auth Guard - Token exists:', !!token);

  if (token) {
    console.log('Auth Guard - Access granted');
    return true;
  } else {
    console.log('Auth Guard - Access denied, redirecting to /signin');
    router.navigate(['/signin']);
    return false;
  }
};
