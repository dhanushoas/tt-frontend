import { Component } from '@angular/core';

@Component({
  selector: 'app-festival-calendar',
  templateUrl: './festival-calendar.component.html',
  styleUrls: ['./festival-calendar.component.css']
})
export class FestivalCalendarComponent {
  festivals = [
    { name: 'Pongal Festival', date: 'Jan 14-17', location: 'Statewide', color: '#ffa502', icon: 'bi-sun-fill' },
    { name: 'Thaipusam', date: 'Jan/Feb', location: 'Palani/Madurai', color: '#ff4757', icon: 'bi-brightness-high' },
    { name: 'Chithirai Festival', date: 'April/May', location: 'Madurai', color: '#5352ed', icon: 'bi-flag-fill' },
    { name: 'Mahamaham', date: 'Feb/Mar', location: 'Kumbakonam', color: '#2ed573', icon: 'bi-water' },
    { name: 'Navaratri', date: 'Sept/Oct', location: 'Kanchipuram', color: '#7f8c8d', icon: 'bi-stars' }
  ];

  getDaysUntil(dateStr: string): string {
    // Mock logic for demo
    return 'Upcoming';
  }
}
