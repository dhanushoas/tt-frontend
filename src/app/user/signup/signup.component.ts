import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showVerificationMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('Signup Component Initialized');
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/@gmail\.com$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=\S+$)/)
        ]
      ]
    });
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.toastService.show('Please fill in all fields correctly', 'warning');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    try {
      await this.authService.signUpWithEmail(email, password);
      this.showVerificationMessage = true;
      this.toastService.show('Account created! Please check your email to verify your account.', 'success');

      // Redirect to signin after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/signin']);
      }, 3000);
    } catch (error: any) {
      console.error('Signup Error:', error);
      this.handleSignupError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async googleSignup(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.authService.signInWithGoogle();
      if (result) {
        this.toastService.show(`Welcome! Signed up successfully.`, 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      console.error('Google Signup Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.toastService.show('Sign-up cancelled', 'info');
      } else if (error.code === 'auth/unauthorized-domain') {
        this.toastService.show('This domain is not authorized. Please contact support.', 'danger');
      } else {
        this.toastService.show('Google sign-up failed. Please try again.', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  private handleSignupError(error: any): void {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.toastService.show('This email is already registered. Please sign in instead.', 'warning');
        break;
      case 'auth/invalid-email':
        this.toastService.show('Invalid email address', 'danger');
        break;
      case 'auth/weak-password':
        this.toastService.show('Password is too weak. Please use a stronger password.', 'warning');
        break;
      case 'auth/operation-not-allowed':
        this.toastService.show('Email/password sign-up is not enabled. Please contact support.', 'danger');
        break;
      default:
        this.toastService.show('Sign-up failed. Please try again.', 'danger');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignin(): void {
    this.router.navigate(['/signin']);
  }
}
