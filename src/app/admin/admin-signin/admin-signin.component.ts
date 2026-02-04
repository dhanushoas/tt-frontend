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
          console.log('Signin admin:', loginData.adminname);
          this.toastService.show(`Login Successful. Welcome, ${loginData.adminname}!`, 'success');

          this.adminService.setLoggedInAdmin(loginData.adminname);
          this.adminService.authenticateAdmin(true);

          // Navigate to the home page
          this.router.navigate(['/admin-home']);
        },
        (error: any) => {
          this.toastService.show('Invalid adminname or password', 'danger');
        }
      );
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
