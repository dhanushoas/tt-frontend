import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-traveler-pass',
  templateUrl: './traveler-pass.component.html',
  styleUrls: ['./traveler-pass.component.css']
})
export class TravelerPassComponent {
  @Input() booking: any;
  @Output() close = new EventEmitter<void>();

  getTodayDate(): string {
    return new Date().toLocaleDateString();
  }

  printPass() {
    window.print();
  }
}
