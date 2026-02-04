import { Component } from '@angular/core';
import { PaymentService } from 'src/app/book-now/payment/payment.service';


@Component({
  selector: 'app-all-payments',
  templateUrl: './all-payments.component.html',
  styleUrls: ['./all-payments.component.css']
})
export class AllPaymentsComponent {
  payments: any[] = [];
  showPayments: boolean = false;
  paymentsColor:string = 'blue';

  constructor(private paymentService: PaymentService) {}

  togglePayments() {
    this.showPayments = !this.showPayments;
    if (this.showPayments && this.payments.length === 0) {
      this.getAllPayments();
    }
  }

  getAllPayments() {
    this.paymentService.getAllPayments().subscribe(
      (response: any) => {
        if (response.success) {
          this.payments = response.payments;
        } else {
          alert('Failed to fetch payments');
        }
      },
      (error: any) => {
        console.error(error);
        alert('Error fetching payments!');
      }
    );
  }
}
