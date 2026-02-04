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
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    const storedAdmin = localStorage.getItem('loggedInAdminname');
  
    if (storedUser && storedAdmin) {
      // If both user and admin are logged in, log out both
      this.userSignOut();
      this.adminSignOut();
    } else if (storedUser) {
      // If user is logged in, set user and fetch selected place count
      this.user = { username: storedUser };
      this.fetchSelectedPlaceCount();
      this.startCounting();
    } else if (storedAdmin) {
      // If admin is logged in, set admin
      this.admin = { adminname: storedAdmin };
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

    if (loggedInUser) {
      this.visitService.getSelectedPlaceCount().subscribe(
        (response: any) => {
          this.selectedPlaceCount = response.count;
        }
      );
    } else {
      this.selectedPlaceCount = 0;
    }
  }

  private startCounting(): void {
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.visitService.getSelectedPlaceCount()),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (response: any) => {
          this.selectedPlaceCount = response.count;
        },
        (error: any) => {
          console.log('Error fetching selected places count', error);
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
