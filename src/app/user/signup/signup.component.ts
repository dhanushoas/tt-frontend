import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  showLoginForm: boolean = true;
  registerForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.initializeRegisterForm();
  }

  ngOnInit(): void {
    console.log('Signup Initialized');
  }

  // Custom validator function
  noSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value && /\s/.test(control.value)) {
        return { noSpace: true }; // Validation failed
      }
      return null; // Validation passed
    };
  }

  private initializeRegisterForm() {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[A-Z][a-zA-Z]*( [A-Z][a-zA-Z]*)*$/),
          Validators.pattern(/^[^\s].*$/)
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^[A-Z][a-zA-Z]*$/),
          Validators.pattern(/^[^\s].*$/)
        ]
      ],
      gmailId: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/@gmail\.com$/),
          Validators.pattern(/^[^\s].*$/)
        ]
      ],
      dob: [null, [Validators.required, this.dateOfBirthValidator]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=\S+$)/),
          this.noSpaceValidator()
        ]
      ],
    });
  }

  private dateOfBirthValidator(control: any) {
    const dob = new Date(control.value);
    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear - 100, 0, 1); // Minimum age: 100 years
    const maxDate = new Date(currentYear - 18, 11, 31); // Maximum age: 18 years

    if (dob < minDate || dob > maxDate) {
      return { invalidDateOfBirth: true };
    }

    return null;
  }

  register() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      // Check if Gmail ID already exists before attempting registration
      this.userService.checkIfEmailExists(user.gmailId).subscribe(
        (response: any) => {
          if (response.exists) {
            alert('Gmail ID already registered');
          } else {
            // Continue with registration
            if (!this.isFirstLetterCapital(user.firstName) || !this.isFirstLetterCapital(user.lastName)) {
              alert('First letter of the names must be capitalized.');
              return;
            }

            user.username = this.createUsername(user.firstName, user.lastName);

            this.userService.registerUser(user).subscribe(
              (registerResponse: any) => {
                if (registerResponse.message === 'Registered successfully') {
                  alert('Registered Successfully');
                  this.router.navigate(['/signin']);
                } else {
                  alert('Registration failed');
                }
              },
              (error: any) => this.handleRegistrationError(error)
            );
          }
        },
        (error: any) => {
          console.error(error);
          alert('Error checking Gmail ID. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  private handleRegistrationError(error: any) {
    console.error(error);
    alert('Error during registration. Please try again.');
  }

  private createUsername(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }

  private isFirstLetterCapital(name: string): boolean {
    return /^[A-Z]/.test(name);
  }

  signin() {
    this.router.navigate(['/signin']);
  }

  async googleLogin() {
    try {
      const idToken = await this.authService.signInWithGoogle();
      this.userService.googleLogin(idToken).subscribe(
        (response: any) => {
          if (response.authenticated) {
            localStorage.setItem('token', response.token);
            this.userService.setLoggedInUser(response.username);
            alert(`Signup/Login Successful. Welcome, ${response.username}!`);
            this.router.navigate(['/home']);
          }
        },
        (error: any) => {
          console.error('Backend Verification Failed', error);
          alert('Signup failed');
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
