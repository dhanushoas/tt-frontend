import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user/user.service';
import { VisitService } from './tamilnadu/visit.service';
import { interval, Subject } from 'rxjs';
import { switchMap, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (this.router.url === '/signin' || this.router.url === '/signup' || this.router.url.includes('admin/signin') || this.router.url.includes('admin/signup')) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    });
  }

  ngOnInit() {
  }
}
