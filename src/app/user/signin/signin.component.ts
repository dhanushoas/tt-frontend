import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
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
      const user = await this.authService.signInWithEmail(email, password);

      if (user) {
        this.toastService.show(`Welcome back!`, 'success');
        this.router.navigate(['/home']);
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
    switch (error.code) {
      case 'auth/user-not-found':
        this.toastService.show('No account found with this email. Please sign up first.', 'warning');
        break;
      case 'auth/wrong-password':
        this.toastService.show('Incorrect password. Please try again.', 'danger');
        break;
      case 'auth/invalid-email':
        this.toastService.show('Invalid email address', 'danger');
        break;
      case 'auth/user-disabled':
        this.toastService.show('This account has been disabled. Please contact support.', 'danger');
        break;
      case 'auth/too-many-requests':
        this.toastService.show('Too many failed attempts. Please try again later.', 'warning');
        break;
      case 'auth/invalid-credential':
        this.toastService.show('Invalid email or password', 'danger');
        break;
      default:
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
