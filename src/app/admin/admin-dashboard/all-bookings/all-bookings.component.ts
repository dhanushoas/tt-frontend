import { Component } from '@angular/core';
import { BookService } from 'src/app/book-now/book.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-all-bookings',
  templateUrl: './all-bookings.component.html',
  styleUrls: ['./all-bookings.component.css']
})
export class AllBookingsComponent {
  bookings: any[] = [];
  showBookings: boolean = false;
  bookingColor: string = 'blue';

  constructor(private bookingService: BookService, private toastService: ToastService) { }

  toggleBookings() {
    this.showBookings = !this.showBookings;
    if (this.showBookings && this.bookings.length === 0) {
      this.getAllBookings();
    }
  }

  getAllBookings() {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        if (response.success) {
          this.bookings = response.bookings;
        } else {
          this.toastService.show('Failed to fetch bookings', 'danger');
        }
      },
      (error: any) => {
        console.error(error);
        this.toastService.show('Error fetching bookings!', 'danger');
      }
    );
  }
}
