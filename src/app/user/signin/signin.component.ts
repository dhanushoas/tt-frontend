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
        // Update UserService (handles localStorage and subjects)
        this.userService.setLoggedInUser(response.username, response.token);

        this.toastService.show(`Welcome back, ${response.username}!`, 'success');

        // Navigate to home page and replace history entry to prevent back button navigation
        setTimeout(() => {
          console.log('Navigating to /home');
          this.router.navigate(['/home'], { replaceUrl: true }).then(
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
      console.log('Starting Google Sign-In...');
      // 1. Sign in with Firebase
      const fbResult = await this.authService.signInWithGoogle();

      if (fbResult) {
        console.log('Firebase Login Success. User:', fbResult.email);

        // 2. Get the ID token from Firebase user
        const idToken = await fbResult.getIdToken();
        console.log('ID Token retrieved. Sending to backend...');

        // 3. Connect with MongoDB backend
        try {
          const mongoResult: any = await this.userService.googleLogin(idToken).toPromise();
          console.log('Backend Verification Success:', mongoResult);

          if (mongoResult && mongoResult.authenticated) {
            // 4. Store token and update state
            this.userService.setLoggedInUser(mongoResult.username, mongoResult.token);

            this.toastService.show(`Welcome back, ${mongoResult.username}!`, 'success');

            // 5. Navigate and replace history entry
            setTimeout(() => {
              this.router.navigate(['/home'], { replaceUrl: true });
            }, 100);
          }
        } catch (backendError: any) {
          console.error('Backend Verification Failed Status:', backendError.status);
          console.error('Backend Verification Failed Body:', JSON.stringify(backendError.error, null, 2));
          if (backendError.status === 503) {
            const diag = backendError.error?.diagnostic;
            let msg = 'Server Auth Service Unavailable.';
            if (diag) {
              msg += ` (EnvVar: ${diag.hasEnvVar}, Error: ${diag.initError})`;
            }
            this.toastService.show(msg, 'danger');
          } else {
            this.toastService.show('Login verification failed on server.', 'danger');
          }
        }
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.toastService.show('Sign-in cancelled', 'info');
      } else if (error.code === 'auth/unauthorized-domain') {
        this.toastService.show('Domain not authorized in Firebase Console.', 'danger');
      } else if (error.code === 'auth/popup-blocked') {
        this.toastService.show('Popup blocked. Please allow popups for this site.', 'warning');
      } else {
        this.toastService.show('Google sign-in failed. Check console for details.', 'danger');
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
