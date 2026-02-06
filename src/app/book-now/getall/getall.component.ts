import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-getall',
  templateUrl: './getall.component.html',
  styleUrls: ['./getall.component.css']
})
export class GetallComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks(): void {
    const signedInUsername = this.userService.getLoggedInUser();
    if (signedInUsername) {
      this.bookService.getAllBooks(signedInUsername).subscribe(
        (response: any) => {
          if (response.bookings) {
            this.books = response.bookings;
            console.log(this.books);
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error: any) => {
          console.error('Error fetching books:', error);
        }
      );
    } else {
      console.error('Error: No signed-in username available');
    }
  }

  gotoUpdate(customId: string): void {
    this.router.navigate(['update', customId]);
  }

  gotoDelete(customId: string): void {
    this.bookService.removeBook(customId).subscribe(
      () => {
        console.log('Book Deleted Successfully');
        this.getAllBooks(); // Refresh the list after deletion
      },
      (error: any) => {
        console.error('Error deleting book:', error);
      }
    );
  }

  gotoGet(customId: string): void {
    if (customId) {
      this.router.navigate(['view', customId]);
    } else {
      console.error('Invalid customId:', customId);
    }
  }

  showPass: boolean = false;
  selectedBooking: any = null;

  viewPass(booking: any) {
    this.selectedBooking = booking;
    this.showPass = true;
  }

  closePass() {
    this.showPass = false;
    this.selectedBooking = null;
  }

  handleCheckIn(booking: any) {
    // Mock check-in logic
    booking.checkedIn = true;
    localStorage.setItem(`checkin_${booking.customId}`, 'true');
    // In a real app, this would call an API
    alert(`Welcome to ${booking.visitingPlaces.split(',')[0]}! You have successfully checked in.`);
  }

  isCheckInDisabled(booking: any): boolean {
    return !!localStorage.getItem(`checkin_${booking.customId}`);
  }

  gotoPayment(customId: string): void {
    console.log(`Initiating payment for customId: ${customId}`);
    this.router.navigate(['/payment']);
  }
}
