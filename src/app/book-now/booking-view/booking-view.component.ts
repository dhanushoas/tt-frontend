// booking-view.component.ts
import { Component, OnInit } from '@angular/core';
import { VisitService } from 'src/app/tamilnadu/visit.service';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/admin/admin-dashboard/image-upload/image.service';

// Define the SelectedPlace type
type SelectedPlace = {
  length: number;
  // Define the structure of SelectedPlace
  // For example:
  name: string;
  location: string;
  // Add more properties as needed
};

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.css']
})
export class BookingViewComponent implements OnInit {

  selectedPlaces: SelectedPlace[] = [];

  constructor(private visitService: VisitService, private router: Router, private imageService: ImageService) {}

  ngOnInit() {
    this.fetchImage('empty', 'emptyImage');
    this.refreshSelectedPlaces();
  }

   emptyImage: string = ''; 
  
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

  refreshSelectedPlaces(): void {
    this.visitService.getAllSelectedPlaces().subscribe(
      (response: any) => {
        if (response.success) {
          const places = response.selectedPlaces?.selectedPlaces || [];
          this.selectedPlaces = places.map((place: any) => ({
            name: place.name,
            location: this.capitalizeFirstLetter(place.location)
          }));
          console.log('Fetched places by logged-in username:', this.selectedPlaces);
        } else {
          console.error('Error fetching selected places:', response.error);
        }
      },
      (error) => {
        console.error('Error fetching selected places', error);
      }
    );
  }

  // Method to capitalize the first letter of a string
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  removePlace(place: SelectedPlace): void {
    // Call the service method to remove the place
    this.visitService.removeSelectedPlace(place.name).subscribe(
      () => {
        console.log(`Place ${place.name} removed successfully.`);
        // Refresh the places after removal
        this.refreshSelectedPlaces();
        /* // Reload the window
        window.location.reload(); */
      },
      (error) => {
        console.error(`Error removing place ${place.name}:`, error);
      }
    );
  }
  

  confirmBooking(): void {
    if (this.selectedPlaces.length > 0) {
      this.router.navigate(['/post']); // Navigate only if there are selected places
    } else {
      this.router.navigate(['/empty']);
    }
  }
}
