import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  images: any[] = [];
  selectedPlaces: any[] = [];
  location: string = '';

  constructor(
    private visitService: VisitService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['location']) {
        this.location = params['location'].toLowerCase();
        this.getImages();
      }
    });

    // Load selected places from local storage
    this.loadSelectedPlaces();
  }

  loadSelectedPlaces() {
    this.selectedPlaces = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
  }

  getImages(): void {
    this.visitService.getData(this.location).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.images = data.map((image: { name: string }) => ({
            ...image,
            fileName: image.name,
            name: this.capitalizeFirstLetter(image.name.trim().replace(/\.[^/.]+$/, "") || image.name)
          }));
        } else {
          this.redirectToHome();
        }
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.redirectToHome();
      }
    });
  }

  redirectToHome(): void {
    this.toastService.show(`No images found for "${this.location}". Redirecting to home.`, 'info');
    this.router.navigate(['/']);
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  addtoCartAndStore(image: any): void {
    if (!this.isSelected(image)) {
      const place = {
        name: image.name,
        originalName: image.fileName || image.name,
        location: this.location
      };

      this.selectedPlaces.push(place);
      localStorage.setItem('selectedPlaces', JSON.stringify(this.selectedPlaces));

      // Trigger cart count update in navbar
      window.dispatchEvent(new Event('storage'));

      this.toastService.show('Destination added to your brief!', 'success');
    } else {
      this.toastService.show('This place is already in your trip plan.', 'warning');
    }
  }

  isSelected(image: any): boolean {
    return this.selectedPlaces.some((selectedPlace) => selectedPlace.name === image.name);
  }

  getSelectedPlaceCount(): number {
    return this.selectedPlaces.length;
  }

  getImageUrl(image: any): string {
    return `${environment.apiUrl}/image/images/${image.fileName || image.name}`;
  }
}
