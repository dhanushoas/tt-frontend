import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('Signin Component Initialized');
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.toastService.show('Please enter your email and password', 'warning');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      // Call MongoDB backend login
      const response: any = await this.userService.loginUser({
        email: email,
        password: password
      }).toPromise();

      console.log('Login response:', response);

      if (response && response.authenticated) {
        // Store token and username in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('loggedInUser', response.username);

        console.log('Token stored:', localStorage.getItem('token'));
        console.log('User stored:', localStorage.getItem('loggedInUser'));

        // Update UserService
        this.userService.setLoggedInUser(response.username);

        this.toastService.show(`Welcome back, ${response.username}!`, 'success');

        // Navigate to home page with a small delay to ensure localStorage is updated
        setTimeout(() => {
          console.log('Navigating to /home');
          this.router.navigate(['/home']).then(
            success => console.log('Navigation success:', success),
            error => console.error('Navigation error:', error)
          );
        }, 100);
      } else {
        this.toastService.show('Login failed. Please try again.', 'danger');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      this.handleLoginError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async googleLogin(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.authService.signInWithGoogle();
      if (result) {
        this.toastService.show(`Welcome back!`, 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.toastService.show('Sign-in cancelled', 'info');
      } else if (error.code === 'auth/unauthorized-domain') {
        this.toastService.show('This domain is not authorized. Please contact support.', 'danger');
      } else {
        this.toastService.show('Google sign-in failed. Please try again.', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  private handleLoginError(error: any): void {
    // Handle MongoDB backend errors
    if (error.status === 401) {
      this.toastService.show('Invalid email or password', 'danger');
    } else if (error.error && error.error.message) {
      this.toastService.show(error.error.message, 'danger');
    } else if (error.message) {
      this.toastService.show(error.message, 'danger');
    } else {
      this.toastService.show('Sign-in failed. Please try again.', 'danger');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
