import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-bus-service',
  templateUrl: './bus-service.component.html',
  styleUrls: ['./bus-service.component.css']
})
export class BusServiceComponent {
  requestData = {
    type: 'bus',
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
        this.toastService.show('Bus service request submitted!', 'success');
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
    this.requestData = { type: 'bus', name: '', email: '', details: '' };
  }
}
