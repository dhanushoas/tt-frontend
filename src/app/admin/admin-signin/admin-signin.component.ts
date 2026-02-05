import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-admin-signin',
  templateUrl: './admin-signin.component.html',
  styleUrls: ['./admin-signin.component.css']
})
export class AdminSigninComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting: boolean = false;
  showPassword: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService
  ) {
    this.initializeLoginForm();
  }

  ngOnInit(): void {
    console.log('SigninComponent initialized.');
  }

  private initializeLoginForm() {
    this.loginForm = this.fb.group({
      adminname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), this.noSpaceValidator]],
    });
  }

  noSpaceValidator(control: { value: string }) {
    if (control.value && control.value.trim() === '') {
      return { 'noSpace': true };
    }
    return null;
  }

  login() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      const loginData = this.loginForm.value;
      this.adminService.loginAdmin(loginData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response && response.authenticated) {
            this.toastService.show(`Login Successful. Welcome, ${response.adminname}!`, 'success');
            this.adminService.setLoggedInAdmin(response.adminname, response.token);
            this.router.navigate(['/admin-home'], { replaceUrl: true });
          } else {
            this.toastService.show('Invalid credentials', 'danger');
          }
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Admin login error:', error);
          this.toastService.show('Invalid credentials or Server error', 'danger');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.toastService.show('Please fill in all required fields correctly', 'warning');
    }
  }

  signup() {
    this.router.navigate(['/admin-signup']).then(() => {
      this.adminService.signOut();
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
