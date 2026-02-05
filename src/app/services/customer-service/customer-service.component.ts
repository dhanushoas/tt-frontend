import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.css']
})
export class CustomerServiceComponent {
  requestData = {
    type: 'customer',
    name: '',
    email: '',
    details: ''
  };
  isSubmitting = false;

  constructor(private http: HttpClient, private toastService: ToastService) { }

  onSubmit() {
    this.isSubmitting = true;
    this.http.post(`${environment.apiUrl}/service-request/submit`, this.requestData).subscribe({
      next: (res: any) => {
        this.toastService.show('Support request submitted!', 'success');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.toastService.show('Failed to submit request', 'danger');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.requestData = { type: 'customer', name: '', email: '', details: '' };
  }
}
