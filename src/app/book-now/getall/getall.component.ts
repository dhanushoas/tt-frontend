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

  constructor(private bookService: BookService, private userService: UserService, private router: Router) {}

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

  gotoUpdate(customId: number): void {
    this.router.navigate(['update', customId]);
  }

  gotoDelete(customId: number): void {
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

  gotoGet(customId: number): void {
    if (customId) {
      this.router.navigate(['view', customId]);
    } else {
      console.error('Invalid customId:', customId);
    }
  }

  gotoPayment(customId: number): void {
    console.log(`Initiating payment for customId: ${customId}`);
    this.router.navigate(['/payment']);
  }
}
