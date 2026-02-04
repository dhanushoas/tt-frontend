import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { interval, Subject } from 'rxjs';
import { switchMap, startWith, takeUntil } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { VisitService } from '../tamilnadu/visit.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isBackgroundWhite: boolean = false;
  user: any;
  admin: any;
  showSignOutOptions: boolean = false;
  selectedPlaceCount: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication state for reactive updates
    this.userService.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAuthenticated => {
      const storedUser = localStorage.getItem('loggedInUser');
      const storedAdmin = localStorage.getItem('loggedInAdminname');
      const token = localStorage.getItem('token');

      if (isAuthenticated && storedUser && token) {
        this.user = { username: storedUser };
        this.fetchSelectedPlaceCount();
        this.startCounting();
      } else if (storedAdmin) {
        this.admin = { adminname: storedAdmin };
      } else {
        this.user = null;
        this.admin = null;
        this.selectedPlaceCount = 0;
      }
    });

    // Check for dual login on init
    const storedUser = localStorage.getItem('loggedInUser');
    const storedAdmin = localStorage.getItem('loggedInAdminname');
    if (storedUser && storedAdmin) {
      this.userSignOut();
      this.adminSignOut();
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSignOutOptions() {
    this.showSignOutOptions = !this.showSignOutOptions;
  }

  fetchSelectedPlaceCount(): void {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('token');

    if (loggedInUser && token) {
      this.visitService.getSelectedPlaceCount().subscribe(
        (response: any) => {
          this.selectedPlaceCount = response.count;
        },
        (error: any) => {
          // Silently handle error to avoid console spam
          this.selectedPlaceCount = 0;
        }
      );
    } else {
      this.selectedPlaceCount = 0;
    }
  }

  private startCounting(): void {
    const token = localStorage.getItem('token');

    // Only start polling if user is authenticated
    if (!token) {
      return;
    }

    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => {
          // Check token on each poll
          const currentToken = localStorage.getItem('token');
          if (!currentToken) {
            throw new Error('No token available');
          }
          return this.visitService.getSelectedPlaceCount();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.selectedPlaceCount = response.count;
        },
        (error: any) => {
          // Silently handle error - user might have logged out
          this.selectedPlaceCount = 0;
        }
      );
  }

  userSignOut() {
    localStorage.removeItem('loggedInUser');
    this.selectedPlaceCount = 0;
    this.user = null;

    // Clear admin sign-in when user signs in
    localStorage.removeItem('loggedInAdminname');

    this.router.navigate(['/signin']);
  }

  adminSignOut() {
    localStorage.removeItem('loggedInAdminname');
    this.admin = null;

    // Clear user sign-in when admin signs in
    localStorage.removeItem('loggedInUser');

    this.router.navigate(['/admin-signin']);
  }

}
