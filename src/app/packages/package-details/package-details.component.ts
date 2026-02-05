import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitService } from '../../tamilnadu/visit.service';
import { UserService } from '../../user/user.service';
import { ToastService } from '../../toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {

  images: any[] = [];
  selectedPlaces: any[] = [];
  category: string = '';
  loading: boolean = true;

  constructor(
    private visitService: VisitService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params['category']) {
        this.category = params['category'].toLowerCase();
        this.getImages();
      } else {
        this.loading = false;
      }
    });

    // Load pre-selected places if any
    if (this.userService.getLoggedInUser()) {
      this.visitService.getAllSelectedPlaces().subscribe(
        (response: any) => {
          if (response && response.success && response.selectedPlaces) {
            // Depending on backend structure, it might be nested or direct array
            // Adjusting based on previous knowledge of selectedPlace.js schema
            const places = response.selectedPlaces.selectedPlaces || [];
            this.selectedPlaces = places;
          }
        },
        (error: any) => console.error(error)
      );
    }
  }

  getImages(): void {
    this.loading = true;
    this.visitService.getData(this.category).subscribe({
      next: (data: any[]) => {
        this.loading = false;
        if (data && data.length > 0) {
          this.images = data.map((image: { name: string }) => ({
            ...image,
            name: this.capitalizeFirstLetter(image.name)
          }));
        } else {
          this.toastService.show(`No existing packages found for "${this.capitalizeFirstLetter(this.category)}".`, 'warning');
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error loading images:', error);
        this.toastService.show('Error loading package details.', 'danger');
      }
    });
  }

  capitalizeFirstLetter(word: string): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
  }

  addtoCartAndStore(image: any): void {
    const isLoggedIn = this.userService.getLoggedInUser() !== null;

    if (isLoggedIn) {
      if (!this.isSelected(image)) {
        const username = this.userService.getLoggedInUser();
        const location = this.category; // Use category as location for storage
        const place = { name: image.name, location, username };

        // Optimistically add to UI
        this.selectedPlaces.push(place);

        this.visitService.storeSelectedPlaces({ username, location, selectedPlaces: [place.name] }).subscribe({
          next: (response: any) => {
            this.toastService.show(`${image.name} added to your booking list!`, 'success');
          },
          error: (error: any) => {
            console.error('Error storing selected places:', error);
            // Revert on error
            this.selectedPlaces = this.selectedPlaces.filter(p => p.name !== image.name);
            this.toastService.show('Failed to add place. Please try again.', 'danger');
          }
        });
      } else {
        this.toastService.show('This place is already in your list.', 'info');
      }
    } else {
      this.toastService.show('Please sign in to book packages.', 'info');
      this.router.navigate(['/signin']);
    }
  }

  isSelected(image: any): boolean {
    return this.selectedPlaces.some((selectedPlace) => selectedPlace.name === image.name);
  }

  getFormattedCategory(): string {
    if (this.category === 'party') return 'DJ & Party';
    return this.capitalizeFirstLetter(this.category);
  }

  getImageUrl(imageName: string): string {
    return `${environment.apiUrl}/image/images/${imageName}`;
  }

  proceedToBooking(): void {
    this.router.navigate(['/booking-view']);
  }
}
