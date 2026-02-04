import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VisitService } from 'src/app/tamilnadu/visit.service';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { ImageService } from 'src/app/admin/admin-dashboard/image-upload/image.service';

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
    private imageService: ImageService

  ) {
    const generatedBookingId = Math.floor(100000 + Math.random() * 900000);

    this.bookForm = this.fb.group({
      customId: [generatedBookingId, [Validators.required, Validators.pattern('[0-9]{6}')]],
      nameOfVisitor: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      date: [this.getTodayDate(), Validators.required],
      visitingPlaces: ['', Validators.required],
      noOfDays: ['', Validators.required],
      noOfMembers: ['', Validators.required],
      totalCost: [this.baseCost, Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchImage('booking', 'bookingImage');
    // Fetch selected places and set the default visitor name
    this.visitService.getAllSelectedPlaces().subscribe(
      (response: any) => {
        if (response.success) {
          const selectedPlacesArray = response.selectedPlaces.selectedPlaces || [];
          const selectedPlaceNames = Array.isArray(selectedPlacesArray)
            ? selectedPlacesArray.map((place: any) => place.name)
            : [];

          this.bookForm.get('visitingPlaces')?.setValue(selectedPlaceNames.join(', '));

          // Set default visitor name if signed in
          const signedInUsername = this.userService.getLoggedInUser();
          const defaultValue = signedInUsername ? signedInUsername : '';
          this.bookForm.get('nameOfVisitor')?.setValue(defaultValue);
        } else {
          console.error('Error fetching selected places:', response.error);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );

    // Subscribe to form value changes to update total cost
    this.bookForm.get('noOfDays')?.valueChanges.subscribe(() => {
      this.updateTotalCost();
    });

    this.bookForm.get('noOfMembers')?.valueChanges.subscribe(() => {
      this.updateTotalCost();
    });
  }

  updateTotalCost(): void {
    // Calculate total cost based on form inputs
    const noOfDays = this.bookForm.get('noOfDays')?.value || 0;
    const noOfMembers = this.bookForm.get('noOfMembers')?.value || 0;
    const visitingPlaces = this.bookForm.get('visitingPlaces')?.value;
    const visitingPlacesCount = visitingPlaces ? visitingPlaces.split(',').length : 0;

    let additionalCost = 0;

    // Calculate additional cost per member
    if (noOfMembers > 0) {
      additionalCost += this.additionalCostPerMember * noOfMembers;
    }

    // Calculate additional cost per day
    if (noOfDays > 0) {
      additionalCost += this.additionalCostPerDay * noOfDays;
    }

    // Calculate additional cost based on the number of visiting places
    additionalCost += visitingPlacesCount * this.additionalCostPerPlace;

    const totalCost = additionalCost;

    this.bookForm.get('totalCost')?.setValue(totalCost);
  }

  postBooks(): void {
    // Check if user is signed in
    const signedInUsername = this.userService.getLoggedInUser();
    if (signedInUsername) {
      const bookToPost: Book = { ...this.bookForm.value, username: signedInUsername };
  
      // Post the book
      this.bookService.addBook(bookToPost).subscribe(
        (response: any) => {
          if (response && response.message === 'Book added successfully' && response.book) {
            alert('Form submitted successfully!');
  
            // Remove selected places from MongoDB
            this.visitService.deleteSelectedPlaces(signedInUsername).subscribe(
              () => {
                console.log('Selected places removed successfully from MongoDB');
                // Navigate back to the booking view
                this.router.navigate(['getall']);
              },
              (error: any) => {
                console.error('Error removing selected places from MongoDB:', error);
                // Navigate back to the booking view even if there's an error
                this.router.navigate(['getall']);
              }
            );
          } else {
            console.error('Error posting book:', response && response.message);
          }
        },
        (error: any) => {
          console.error('Error posting book:', error);
        }
      );
    } else {
      console.error('Error: No signed-in username available');
    }
  }
  
  

  onCancel(): void {
    this.router.navigate(['booking-view']);
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

   bookingImage: string = ''; 
  
    fetchImage(imageName: string, property: keyof this) {
      this.imageService.getImageByName(imageName).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: response.type });
          (this as any)[property] = URL.createObjectURL(blob);
        },
        error: (err) => {
          console.error(`Error fetching ${imageName} image:`, err);
        }
      });
    }
  
}