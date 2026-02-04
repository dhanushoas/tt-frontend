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
  showLoginForm: boolean = false;
  loginForm!: FormGroup;

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
      const loginData = this.loginForm.value;
      this.adminService.loginAdmin(loginData).subscribe(
        (response: any) => {
          if (response && response.authenticated) {
            console.log('Signin admin:', response.adminname);
            this.toastService.show(`Login Successful. Welcome, ${response.adminname}!`, 'success');

            // Store admin token and name
            this.adminService.setLoggedInAdmin(response.adminname, response.token);

            // Navigate to the admin home page
            this.router.navigate(['/admin-home']);
          } else {
            this.toastService.show('Invalid credentials', 'danger');
          }
        },
        (error: any) => {
          console.error('Admin login error:', error);
          this.toastService.show('Invalid credentials', 'danger');
        }
      );
    } else {
      this.toastService.show('Please fill in all required fields correctly', 'warning');
    }
  }

  signup() {
    this.router.navigate(['/admin-signup']).then(() => {
      this.adminService.signOut();
    });
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
