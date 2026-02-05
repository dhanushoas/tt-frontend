import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';
  isSubmitting: boolean = false;

  constructor(private http: HttpClient, private toastService: ToastService) { }

  subscribe() {
    if (!this.email) {
      this.toastService.show('Please enter an email address', 'danger');
      return;
    }

    this.isSubmitting = true;
    this.http.post(`${environment.apiUrl}/subscription/subscribe`, { email: this.email }).subscribe({
      next: (res: any) => {
        this.toastService.show('Subscribed successfully!', 'success');
        this.email = '';
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.toastService.show(err.error.message || 'Subscription failed', 'danger');
        this.isSubmitting = false;
      }
    });
  }
}
