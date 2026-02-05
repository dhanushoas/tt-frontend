import { Component } from '@angular/core';
import { PaymentService } from 'src/app/book-now/payment/payment.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-all-payments',
  templateUrl: './all-payments.component.html',
  styleUrls: ['./all-payments.component.css']
})
export class AllPaymentsComponent {
  payments: any[] = [];
  showPayments: boolean = false;
  paymentsColor: string = 'blue';

  constructor(private paymentService: PaymentService, private toastService: ToastService) { }

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
          this.toastService.show('Failed to fetch payments', 'danger');
        }
      },
      (error: any) => {
        console.error(error);
        this.toastService.show('Error fetching payments!', 'danger');
      }
    );
  }
}
