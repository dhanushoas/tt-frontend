import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VisitService } from 'src/app/tamilnadu/visit.service';
import { Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { ImageService } from 'src/app/admin/admin-dashboard/image-upload/image.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  bookForm: FormGroup;
  baseCost: number = 0;
  additionalCostPerMember: number = 200;
  additionalCostPerDay: number = 1000;
  additionalCostPerPlace: number = 500;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private visitService: VisitService,
    private router: Router,
    private imageService: ImageService,
    private toastService: ToastService
  ) {
    const generatedBookingId = Math.floor(100000 + Math.random() * 900000);

    this.bookForm = this.fb.group({
      customId: [generatedBookingId.toString(), [Validators.required]],
      nameOfVisitor: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      monthOfVisit: ['', Validators.required],
      budget: ['', Validators.required],
      noOfMembers: [1, [Validators.required, Validators.min(1)]],
      hotel: [''],
      arrivalDepartureCity: [''],
      requirement: [''],
      date: [this.getTodayDate()],
      visitingPlaces: [''],
      noOfDays: [1],
      totalCost: [0],
    });
  }

  ngOnInit(): void {
    this.fetchImage('booking', 'bookingImage');

    // Fetch selected places from localStorage (since we removed sign-in)
    const storedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
    if (storedPlaces.length > 0) {
      const selectedPlaceNames = storedPlaces.map((item: any) => {
        const name = typeof item === 'object' ? item.name : item;
        return name.trim().replace(/\.[^/.]+$/, "") || name;
      });

      this.bookForm.get('visitingPlaces')?.setValue(selectedPlaceNames.join(', '));
      this.bookForm.get('noOfDays')?.setValue(Math.max(1, Math.ceil(selectedPlaceNames.length / 2)));
      this.updateTotalCost();
    }

    // Auto-fill visitor name if exists in local storage (optional preference)
    const storedName = localStorage.getItem('visitorName');
    if (storedName) {
      this.bookForm.get('nameOfVisitor')?.setValue(storedName);
    }

    // Watchers for cost calculation
    this.bookForm.get('noOfMembers')?.valueChanges.subscribe(() => this.updateTotalCost());
  }

  updateTotalCost(): void {
    const noOfDays = this.bookForm.get('noOfDays')?.value || 1;
    const noOfMembers = this.bookForm.get('noOfMembers')?.value || 1;
    const visitingPlaces = this.bookForm.get('visitingPlaces')?.value;
    const visitingPlacesCount = visitingPlaces ? visitingPlaces.split(',').length : 0;

    let total = (noOfMembers * this.additionalCostPerMember) +
      (noOfDays * this.additionalCostPerDay) +
      (visitingPlacesCount * this.additionalCostPerPlace);

    this.bookForm.get('totalCost')?.setValue(total);
  }

  postBooks(): void {
    if (this.bookForm.valid) {
      const bookToPost: Book = { ...this.bookForm.value, username: 'guest' }; // Use guest as default

      this.bookService.addBook(bookToPost).subscribe({
        next: (response: any) => {
          this.toastService.show('Trip Plan Submitted! Confirmation sent to your email.', 'success');

          // Clear cart after submission
          localStorage.removeItem('selectedPlaces');
          // Store name for next time convenience
          localStorage.setItem('visitorName', this.bookForm.get('nameOfVisitor')?.value);

          // Navigate to view page to see summary
          this.router.navigate(['view', this.bookForm.get('customId')?.value]);
        },
        error: (error: any) => {
          console.error(error);
          this.toastService.show('Error submitting form. Please try again.', 'danger');
        }
      });
    } else {
      this.toastService.show('Please fill all required fields correctly.', 'warning');
      this.bookForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['booking-view']);
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  bookingImage: string = '';

  fetchImage(imageName: string, property: keyof this) {
    this.imageService.getImageByName(imageName).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: response.type });
        (this as any)[property] = URL.createObjectURL(blob);
      },
      error: (err) => console.error(`Error fetching ${imageName} image:`, err)
    });
  }

  onlyNumbers(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}