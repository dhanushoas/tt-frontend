import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
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
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['location']) {
        this.location = params['location'].toLowerCase(); // Convert to lowercase
        this.getImages();
      }
    });
  }

  getImages(): void {
    this.visitService.getData(this.location).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.images = data.map((image: { name: string }) => ({
            ...image,
            fileName: image.name, // Original for URL
            name: this.capitalizeFirstLetter(image.name.replace(/\.(jpg|jpeg|png|gif|webp|bmp|JPG|JPEG|PNG|GIF|WEBP|BMP)$/, "") || image.name) // Stripped for UI
          }));
        } else {
          this.redirectToHome(); // If no images, redirect
        }
      },
      error: (error) => {
        console.error('Error loading images:', error);
        this.redirectToHome(); // Handle API errors by redirecting
      }
    });
  }

  redirectToHome(): void {
    this.toastService.show(`No images found for "${this.location}". Redirecting to home.`, 'info');
    this.router.navigate(['/']); // Redirect to home page (or another page)
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  addtoCartAndStore(image: any): void {
    const isLoggedIn = this.userService.getLoggedInUser() !== null;

    if (isLoggedIn) {
      if (!this.isSelected(image)) {
        const username = this.userService.getLoggedInUser();
        const location = this.location;
        const place = { name: image.name, location, username };

        this.selectedPlaces.push(place);

        this.visitService.storeSelectedPlaces({ username, location, selectedPlaces: [place.name] }).subscribe({
          next: (response) => {
            console.log('Selected places stored successfully:', response);
            this.toastService.show('Place added to your visit list!', 'success');
          },
          error: (error) => {
            console.error('Error storing selected places:', error);
            this.toastService.show('Error storing selected places.', 'danger');
          }
        });
      } else {
        this.toastService.show('This place has already been added to your visit.', 'warning');
      }
    } else {
      this.router.navigate(['/signin']);
    }
  }

  isSelected(image: any): boolean {
    return this.selectedPlaces.some((selectedPlace) => selectedPlace.name === image.name);
  }

  getSelectedPlaceCount(): number {
    return this.selectedPlaces.length;
  }

  getSelectedPlaceNames(): string[] {
    return this.selectedPlaces.map(place => place.name);
  }

  getImageUrl(image: any): string {
    return `${environment.apiUrl}/image/images/${image.fileName || image.name}`;
  }
}
