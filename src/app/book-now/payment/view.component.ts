// view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  book: Book = new Book();
  customId: number;
  paymentSuccess: boolean = false;
  paidIds: Set<number> = new Set<number>();

  constructor(
    private bookService: BookService,
    private paymentService: PaymentService,
    private active: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customId = +this.active.snapshot.params['customId'];

    this.bookService.getBookByCustomId(this.customId).subscribe(
      (book: Book) => {
        this.book = book;
      },
      (error: any) => {
        console.error(error);
      }
    );

    // Load paid IDs from localStorage
    const storedPaidIds = localStorage.getItem('paidIds');
    if (storedPaidIds) {
      this.paidIds = new Set<number>(JSON.parse(storedPaidIds));
    }

    // Check if the ID has already been paid for
    if (this.paidIds.has(this.customId)) {
      alert('You have already paid for this ID.');
      this.paymentSuccess = true;
    }
  }

  back() {
    this.router.navigate(['getall']);
  }

  makePayment(customId: number): void {
    if (this.paidIds.has(customId)) {
      alert('You have already paid for this ID.');
      this.paymentSuccess = true;
    } else {
      // Check if the payment date exists for the custom ID
      this.paymentService.getPaidIds().subscribe(
        (paidIds: number[]) => {
          if (paidIds.includes(customId)) {
            alert('You have already paid for this ID.');
            this.paymentSuccess = true;
          } else {
            // Proceed with payment as payment date doesn't exist
            const paymentDetails = {
              customId: this.book.customId,
              nameOfVisitor: this.book.nameOfVisitor,
              mobileNumber: this.book.mobileNumber,
              date: this.book.date,
              visitingPlaces: this.book.visitingPlaces,
              noOfDays: this.book.noOfDays,
              noOfMembers: this.book.noOfMembers,
              totalCost: this.book.totalCost,
            };
  
            this.paymentService.makePayment(paymentDetails).subscribe(
              (paymentResult: any) => {
                if (paymentResult.success) {
                  const paymentId = paymentResult.paymentId;
                  const amount = paymentResult.amount;
          
                  // Show an alert with booking ID and amount
                  alert(`Booking ID: ${paymentId}\nAmount Paid: ${amount}`);
                  this.paymentSuccess = true;
                  this.paidIds.add(customId); // Add the paid ID to the set
          
                  // Save paid IDs to localStorage
                  localStorage.setItem('paidIds', JSON.stringify(Array.from(this.paidIds)));
                } else {
                  console.error('Payment failed:', paymentResult.error);
                  // Show an alert with payment failure message
                  alert('Payment failed. Please try again.');
                  this.paymentSuccess = false;
                }
              },
              (error: any) => {
                console.error('Payment failed:', error);
                // Show an alert with payment failure message
                alert('Payment failed. Please try again.');
                this.paymentSuccess = false;
              }
            );
          }
        },
        (error: any) => {
          console.error('Error fetching paid IDs:', error);
          // Show an alert with error message
          alert('Error fetching paid IDs. Please try again.');
          this.paymentSuccess = false;
        }
      );
    }
  }
  
  

  printReceipt(): void {
    console.log('Printing receipt...');
  }
}