// booking-view.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/admin/admin-dashboard/image-upload/image.service';
import { ToastService } from 'src/app/toast.service';

type SelectedPlace = {
  name: string;
  originalName: string;
  location: string;
};

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.css']
})
export class BookingViewComponent implements OnInit {

  selectedPlaces: SelectedPlace[] = [];

  constructor(
    private router: Router,
    private imageService: ImageService,
    private toastService: ToastService
  ) { }

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
    const places = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
    this.selectedPlaces = places.map((place: any) => ({
      name: place.name,
      originalName: place.originalName || place.name,
      location: this.capitalizeFirstLetter(place.location)
    }));
  }

  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  removePlace(place: any): void {
    const places = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
    const updatedPlaces = places.filter((p: any) => p.name !== place.name);
    localStorage.setItem('selectedPlaces', JSON.stringify(updatedPlaces));

    // Trigger cart count update in navbar
    window.dispatchEvent(new Event('storage'));

    this.refreshSelectedPlaces();
    this.toastService.show('Destination removed from your list.', 'info');
  }


  confirmBooking(): void {
    if (this.selectedPlaces.length > 0) {
      this.router.navigate(['/post']);
    } else {
      this.toastService.show('Please add some places to your trip first!', 'warning');
    }
  }
}
