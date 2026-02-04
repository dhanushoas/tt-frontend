import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

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
    private authService: AuthService
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
        alert(`Login Successful. Welcome, ${username}!`);
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
            alert(`Login Successful. Welcome, ${loginData.username}!`);
            this.userService.setLoggedInUser(loginData.username);
            this.router.navigate(['/home']);
          } else {
            alert('Invalid username or password');
          }
        },
        (error: any) => {
          console.error(error);
          alert('Error during login. Please try again.');
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
            alert(`Login Successful. Welcome, ${response.username}!`);
            this.router.navigate(['/home']);
          }
        },
        (error: any) => {
          console.error('Backend Verification Failed', error);
          alert('Login failed');
        }
      );
    } catch (error) {
      console.error('Google Sign-In Error', error);
    }
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
