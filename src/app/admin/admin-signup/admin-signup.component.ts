import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit {
  showLoginForm: boolean = true;
  registerForm!: FormGroup;
  showPassword: boolean = false; // Added property

  constructor(private adminService: AdminService, private fb: FormBuilder, private router: Router, private toastService: ToastService) {
    this.initializeRegisterForm();
  }

  ngOnInit(): void {
    console.log('Admin-Signup Initialized');
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
      dob: [null, [Validators.required, this.dateOfBirthValidator.bind(this)]],
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

  private dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
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
      const admin = this.registerForm.value;

      // Check if Gmail ID already exists before attempting registration
      this.adminService.checkIfEmailExists(admin.gmailId).subscribe(
        (response: any) => {
          if (response.exists) {
            this.toastService.show('Gmail ID already registered', 'danger');
          } else {
            // Continue with registration
            if (!this.isFirstLetterCapital(admin.firstName) || !this.isFirstLetterCapital(admin.lastName)) {
              this.toastService.show('First letter of the names must be capitalized.', 'warning');
              return;
            }

            admin.adminname = this.createAdminname(admin.firstName, admin.lastName);

            this.adminService.registerAdmin(admin).subscribe(
              (registerResponse: any) => {
                if (registerResponse.message === 'Registered successfully') {
                  this.toastService.show('Registered Successfully', 'success');
                  this.router.navigate(['/admin-signin']);
                } else {
                  this.toastService.show('Registration failed', 'danger');
                }
              },
              (error: any) => this.handleRegistrationError(error)
            );
          }
        },
        (error: any) => {
          console.error(error);
          this.toastService.show('Error checking Gmail ID. Please try again.', 'danger');
        }
      );
    } else {
      this.toastService.show('Please fill in all required fields.', 'warning');
    }
  }

  isFirstLetterCapital(name: string): boolean {
    return /^[A-Z]/.test(name);
  }

  createAdminname(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }

  private handleRegistrationError(error: any) {
    console.error(error);
    this.toastService.show('Registration failed', 'danger');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  signin() {
    this.router.navigate(['/admin-signin']);
  }
}
