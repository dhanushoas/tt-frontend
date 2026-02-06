import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VisitService } from 'src/app/tamilnadu/visit.service';
import { UserService } from 'src/app/user/user.service';
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
    private userService: UserService,
    private router: Router,
    private imageService: ImageService,
    private toastService: ToastService

  ) {
    const generatedBookingId = Math.floor(100000 + Math.random() * 900000);

    this.bookForm = this.fb.group({
      customId: [generatedBookingId, [Validators.required]],
      nameOfVisitor: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      monthOfVisit: ['', Validators.required],
      budget: ['', Validators.required],
      noOfMembers: [1, [Validators.required, Validators.min(1)]],
      hotel: [''],
      arrivalDepartureCity: [''],
      requirement: [''],
      // Hidden defaults for existing logic
      date: [this.getTodayDate()],
      visitingPlaces: [''],
      noOfDays: [1],
      totalCost: [0],
    });
  }

  ngOnInit(): void {
    this.fetchImage('booking', 'bookingImage');

    // Fetch selected places
    this.visitService.getAllSelectedPlaces().subscribe(
      (response: any) => {
        if (response.success) {
          const selectedPlacesArray = response.selectedPlaces.selectedPlaces || [];
          const selectedPlaceNames = Array.isArray(selectedPlacesArray)
            ? selectedPlacesArray.map((item: any) => {
              const name = typeof item === 'object' ? item.name : item;
              return name.trim().replace(/\.[^/.]+$/, "") || name;
            })
            : [];

          this.bookForm.get('visitingPlaces')?.setValue(selectedPlaceNames.join(', '));
          this.bookForm.get('noOfDays')?.setValue(Math.max(1, Math.ceil(selectedPlaceNames.length / 2)));

          this.updateTotalCost();

          // Set default values if signed in
          const storedUser = localStorage.getItem('loggedInUser');
          if (storedUser) {
            this.bookForm.get('nameOfVisitor')?.setValue(storedUser);
          }
        }
      }
    );

    // Watchers for cost calculation if needed
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
    const signedInUsername = this.userService.getLoggedInUser();
    if (signedInUsername) {
      const bookToPost: Book = { ...this.bookForm.value, username: signedInUsername };

      this.bookService.addBook(bookToPost).subscribe(
        (response: any) => {
          if (response && response.message === 'Book added successfully') {
            this.toastService.show('Trip Plan Submitted Successfully!', 'success');
            this.visitService.deleteSelectedPlaces(signedInUsername).subscribe(() => {
              this.router.navigate(['getall']);
            });
          }
        },
        (error: any) => {
          this.toastService.show('Error submitting form', 'danger');
        }
      );
    } else {
      this.toastService.show('Please sign in to plan your trip', 'warning');
      this.router.navigate(['signin']);
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