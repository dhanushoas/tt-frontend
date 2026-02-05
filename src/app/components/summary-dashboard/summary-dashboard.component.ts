import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.css']
})
export class SummaryDashboardComponent implements OnInit {
  @Input() bookings: any[] = [];

  stats = {
    totalTrips: 0,
    uniqueDistricts: 0,
    totalMembers: 0,
    explorationPercent: 0
  };

  ngOnInit() {
    this.calculateStats();
  }

  ngOnChanges() {
    this.calculateStats();
  }

  calculateStats() {
    if (!this.bookings) return;

    this.stats.totalTrips = this.bookings.length;

    const districts = new Set();
    let members = 0;

    this.bookings.forEach(b => {
      members += Number(b.noOfMembers || 0);
      // Try to extract locations from visitingPlaces
      if (b.visitingPlaces) {
        districts.add(b.visitingPlaces.split(',')[0]);
      }
    });

    this.stats.uniqueDistricts = districts.size;
    this.stats.totalMembers = members;

    // TN has 38 districts
    this.stats.explorationPercent = Math.min(100, Math.round((districts.size / 38) * 100));
  }
}
