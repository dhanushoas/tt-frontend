import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  constructor(private http: HttpClient, private toastService: ToastService) { }

  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      const url = `${environment.apiUrl}/contact/submit`;

      this.http.post(url, this.contactData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.toastService.show('Message sent successfully! We will get back to you soon.', 'success');
          this.resetForm();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Submission error', error);
          this.toastService.show('Failed to send message. Please try again later.', 'danger');
        }
      });
    }
  }

  isFormValid(): boolean {
    return this.contactData.name.trim() !== '' &&
      this.contactData.email.trim() !== '' &&
      this.contactData.subject.trim() !== '' &&
      this.contactData.message.trim() !== '';
  }

  resetForm() {
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
