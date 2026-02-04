import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { interval, Subject } from 'rxjs';
import { switchMap, startWith, takeUntil } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
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
    private adminService: AdminService,
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    // Subscribe to user authentication state
    this.userService.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAuthenticated => {
      const storedUser = localStorage.getItem('loggedInUser');
      const token = localStorage.getItem('token');

      if (isAuthenticated && storedUser && token) {
        this.user = { username: storedUser };
        this.fetchSelectedPlaceCount();
        this.startCounting();
      } else {
        this.user = null;
        this.selectedPlaceCount = 0;
      }
    });

    // Subscribe to admin authentication state
    this.adminService.isAdminAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAdminAuthenticated => {
      const storedAdmin = localStorage.getItem('loggedInAdminname');
      if (isAdminAuthenticated && storedAdmin) {
        this.admin = { adminname: storedAdmin };
      } else {
        this.admin = null;
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
    this.userService.signOut();
  }

  adminSignOut() {
    this.adminService.signOut();
  }

}
