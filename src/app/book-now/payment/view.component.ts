// view.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { PaymentService } from './payment.service';
import { ToastService } from 'src/app/toast.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  book: Book = new Book();
  customId: string;
  paymentSuccess: boolean = false;
  paidIds: Set<string> = new Set<string>();

  constructor(
    private bookService: BookService,
    private paymentService: PaymentService,
    private active: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.customId = this.active.snapshot.params['customId'];

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
      this.paidIds = new Set<string>(JSON.parse(storedPaidIds));
    }

    // Check if the ID has already been paid for
    if (this.paidIds.has(this.customId)) {
      this.toastService.show('You have already paid for this ID.', 'info');
      this.paymentSuccess = true;
    }
  }

  back() {
    this.router.navigate(['getall']);
  }

  makePayment(customId: string): void {
    if (this.paidIds.has(customId)) {
      this.toastService.show('You have already paid for this ID.', 'info');
      this.paymentSuccess = true;
    } else {
      // Check if the payment date exists for the custom ID
      this.paymentService.getPaidIds().subscribe(
        (paidIds: string[]) => {
          if (paidIds.includes(customId)) {
            this.toastService.show('You have already paid for this ID.', 'info');
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

                  // Show toast with booking ID and amount
                  this.toastService.show(`Booking ID: ${paymentId}\nAmount Paid: ${amount}`, 'success');
                  this.paymentSuccess = true;
                  this.paidIds.add(customId); // Add the paid ID to the set

                  // Save paid IDs to localStorage
                  localStorage.setItem('paidIds', JSON.stringify(Array.from(this.paidIds)));
                } else {
                  console.error('Payment failed:', paymentResult.error);
                  // Show toast with payment failure message
                  this.toastService.show('Payment failed. Please try again.', 'danger');
                  this.paymentSuccess = false;
                }
              },
              (error: any) => {
                console.error('Payment failed:', error);
                // Show toast with payment failure message
                this.toastService.show('Payment failed. Please try again.', 'danger');
                this.paymentSuccess = false;
              }
            );
          }
        },
        (error: any) => {
          console.error('Error fetching paid IDs:', error);
          // Show toast with error message
          this.toastService.show('Error fetching paid IDs. Please try again.', 'danger');
          this.paymentSuccess = false;
        }
      );
    }
  }



  printReceipt(): void {
    console.log('Printing receipt...');
  }
}