import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
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
  showOtpInput: boolean = false;
  otp: string = '';
  registeredEmail: string = '';

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

  // Keypress event to restrict input to numbers only
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.toastService.show('Please fill in all fields correctly', 'warning');
      return;
    }

    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    try {
      // Check if email already exists in MongoDB
      const emailCheck = await this.userService.checkIfEmailExists(email).toPromise();

      if (emailCheck.exists) {
        this.toastService.show('This email is already registered. Redirecting to sign in...', 'warning');
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
        return;
      }

      // Extract username from email (before @)
      const username = email.split('@')[0];

      // Register user in MongoDB
      const userData = {
        username: username,
        gmailId: email,
        password: password,
        dob: new Date() // You can add a DOB field to the form if needed
      };

      const response: any = await this.userService.registerUser(userData).toPromise();

      // Show Verification check UI
      this.registeredEmail = email;
      this.showOtpInput = true;

      if (response.verifyLink) {
        console.log('DEV MODE - Verification Link:', response.verifyLink);
        this.toastService.show('DEV MODE: Verification link logged to console', 'info');
      }

      this.toastService.show('Verification link sent! Check your email.', 'success');
      this.isLoading = false;

    } catch (error: any) {
      console.error('Signup Error:', error);
      this.handleSignupError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async checkVerificationStatus(): Promise<void> {
    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    try {
      // Attempt login to check if verified
      const response: any = await this.userService.loginUser({
        email: email,
        password: password
      }).toPromise();

      if (response && response.authenticated) {
        this.userService.setLoggedInUser(response.username, response.token);
        this.toastService.show('Email verified! Logging in...', 'success');

        setTimeout(() => {
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 500);
      }
    } catch (error: any) {
      // 401 means "Invalid email or password", which in this context (deferred creation) 
      // primarily means the user hasn't been created yet (i.e., not verified).
      if (error.status === 403 || error.status === 401) {
        this.toastService.show('Email not verified yet. Please click the link in your email.', 'warning');
      } else {
        console.error('Verification Check Error:', error);
        this.toastService.show('Verification check failed. Please try again.', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  private handleSignupError(error: any): void {
    // Handle MongoDB backend errors
    if (error.message) {
      if (error.message.includes('Gmail ID already registered') || error.message.includes('already registered')) {
        this.toastService.show('This email is already registered. Redirecting to sign in...', 'warning');
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
      } else {
        this.toastService.show(error.message, 'danger');
      }
    } else if (error.error && error.error.message) {
      this.toastService.show(error.error.message, 'danger');
    } else {
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
