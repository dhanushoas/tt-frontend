import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  showLoginForm: boolean = false;
  loginForm!: FormGroup;
  loggedInUsername: string = '';
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.initializeLoginForm();
  }

  ngOnInit(): void {
    console.log('SigninComponent initialized.');

    // Check for token from Google Login (if using redirect flow, though we are using popup now)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const username = params['username'];
      if (token && username) {
        localStorage.setItem('token', token);
        this.userService.setLoggedInUser(username);
        this.toastService.show(`Login Successful. Welcome, ${username}!`, 'success');
        this.router.navigate(['/home']);
      }
    });

    // Subscribe to Router events to detect when navigation has completed
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reload the page logic if needed
    });
  }

  private initializeLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.userService.loginUser(loginData).subscribe(
        (response: any) => {
          console.log(response);

          if (response.authenticated) {
            console.log('Signin user:', loginData.username);
            this.toastService.show(`Login Successful. Welcome, ${loginData.username}!`, 'success');
            this.userService.setLoggedInUser(loginData.username);
            this.router.navigate(['/home']);
          } else {
            this.toastService.show('Invalid username or password', 'danger');
          }
        },
        (error: any) => {
          console.error(error);
          this.toastService.show('Error during login. Please try again.', 'danger');
        }
      );
    }
  }

  signup() {
    this.router.navigate(['/signup']).then(() => {
      this.userService.signOut();
    });
  }

  async googleLogin() {
    try {
      const idToken = await this.authService.signInWithGoogle();
      this.userService.googleLogin(idToken).subscribe(
        (response: any) => {
          if (response.authenticated) {
            localStorage.setItem('token', response.token);
            this.userService.setLoggedInUser(response.username);
            this.toastService.show(`Login Successful. Welcome, ${response.username}!`, 'success');
            this.router.navigate(['/home']);
          } else {
            this.toastService.show('Authentication failed. Please try again.', 'danger');
          }
        },
        (error: any) => {
          console.error('Backend Verification Failed', error);
          this.toastService.show('Login failed. Please try again.', 'danger');
        }
      );
    } catch (error: any) {
      console.error('Google Sign-In Error', error);
      if (error.code === 'auth/popup-closed-by-user') {
        this.toastService.show('Sign-in cancelled', 'info');
      } else if (error.code === 'auth/unauthorized-domain') {
        this.toastService.show('This domain is not authorized for Google Sign-In. Please contact support.', 'danger');
      } else {
        this.toastService.show('Google Sign-In failed. Please try again.', 'danger');
      }
    }
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
