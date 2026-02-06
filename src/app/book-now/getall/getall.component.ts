import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/user/auth.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-getall',
  templateUrl: './getall.component.html',
  styleUrls: ['./getall.component.css']
})
export class GetallComponent implements OnInit {
  books: Book[] = [];
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private bookService: BookService,
    public userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.userService.isAuthenticated$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.getAllBooks();
      }
    });
  }

  getAllBooks(): void {
    const userEmail = this.userService.getLoggedEmail();
    const username = this.userService.getLoggedInUser();

    this.isLoading = true;

    // Attempt to fetch by email first (ideal for Google users)
    if (userEmail) {
      this.bookService.getBookByEmail(userEmail).subscribe({
        next: (response: any) => {
          this.books = response.bookings || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching by email:', err);
          // Fallback to username if email fails
          if (username) this.fetchByUsername(username);
          else this.isLoading = false;
        }
      });
    } else if (username) {
      this.fetchByUsername(username);
    } else {
      this.isLoading = false;
    }
  }

  private fetchByUsername(username: string): void {
    this.bookService.getAllBooks(username).subscribe({
      next: (response: any) => {
        this.books = response.bookings || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching by username:', err);
        this.isLoading = false;
      }
    });
  }

  async googleLogin(): Promise<void> {
    this.isLoading = true;
    try {
      const fbResult = await this.authService.signInWithGoogle();
      if (fbResult) {
        const idToken = await fbResult.getIdToken();
        const mongoResult: any = await this.userService.googleLogin(idToken).toPromise();

        if (mongoResult && mongoResult.authenticated) {
          this.userService.setLoggedInUser(mongoResult.username, mongoResult.token, mongoResult.email);
          this.toastService.show(`Welcome, ${mongoResult.username}! Retrieving your bookings...`, 'success');
          // getAllBooks() will be triggered by the subscription in ngOnInit
        }
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      this.toastService.show('Failed to sign in with Google', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  gotoGet(customId: string): void {
    this.router.navigate(['view', customId]);
  }

  // Pass logic
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
}
