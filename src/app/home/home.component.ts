import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../tamilnadu/visit.service';
import { ImageService } from '../admin/admin-dashboard/image-upload/image.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchText: string = '';
  districts: string[] = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
    'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
    'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur',
    'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ];
  filteredDistricts: string[] = [];
  selectedIndex: number = -1;

  constructor(private router: Router,
    private visitService: VisitService,
    private imageService: ImageService,
    private toastService: ToastService) { }

  filterDistricts(): void {
    const query = this.searchText.toLowerCase();
    this.filteredDistricts = this.districts.filter(district =>
      district.toLowerCase().startsWith(query)
    );
    this.selectedIndex = -1;
  }

  selectDistrict(district: string): void {
    this.searchText = district;
    this.filteredDistricts = [];
    this.searchDistrict();
  }

  searchDistrict(): void {
    if (this.searchText.trim()) {
      const lowerCaseDistrict = this.searchText.trim().toLowerCase();

      this.visitService.getData(lowerCaseDistrict).subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.router.navigate(['/district'], { queryParams: { location: lowerCaseDistrict } });
          } else {
            this.toastService.show('No districts found. Choose another district name.', 'info');
          }
        },
        error: (error: any) => {
          console.error('Error checking images:', error);
          this.toastService.show('No districts found. Choose another district name.', 'danger');
        }
      });

    } else {
      this.toastService.show('Please enter a district name.', 'warning');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.filteredDistricts.length > 0) {
      if (event.key === 'ArrowDown') {
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredDistricts.length;
      } else if (event.key === 'ArrowUp') {
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredDistricts.length) % this.filteredDistricts.length;
      } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
        this.selectDistrict(this.filteredDistricts[this.selectedIndex]);
      }
    }
  }

  tamilnaduImage: string = '';
  templeImage: string = '';
  educationImage: string = '';
  honeymoonImage: string = '';
  mountainImage: string = '';
  partyImage: string = '';
  beachImage: string = '';
  kanyakumariImage: string = '';
  kodaikanalImage: string = '';
  mahapalipuramImage: string = '';
  samayapuramImage: string = '';
  srirangamImage: string = '';

  // Static cache to store object URLs across component instances
  private static imageCache = new Map<string, string>();

  ngOnInit(): void {
    // Preload important images slightly staggered if needed, but for now just load defaults
    this.loadImage('tamilnadu', 'tamilnaduImage');
    this.loadImage('temple', 'templeImage');
    this.loadImage('education', 'educationImage');
    this.loadImage('honeymoon', 'honeymoonImage');
    this.loadImage('mountain', 'mountainImage');
    this.loadImage('party', 'partyImage');
    this.loadImage('beach', 'beachImage');
    this.loadImage('kanyakumari', 'kanyakumariImage');
    this.loadImage('kodaikanal', 'kodaikanalImage');
    this.loadImage('mahapalipuram', 'mahapalipuramImage');
    this.loadImage('samayapuram', 'samayapuramImage');
    this.loadImage('srirangam', 'srirangamImage');
  }

  fetchImage(imageName: string, property: keyof this) {
    this.loadImage(imageName, property);
  }

  loadImage(imageName: string, property: keyof this) {
    // Check if we already have a cached URL for this image
    if (HomeComponent.imageCache.has(imageName)) {
      (this as any)[property] = HomeComponent.imageCache.get(imageName);
      return;
    }

    this.imageService.getImageByName(imageName).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: response.type });
        const url = URL.createObjectURL(blob);
        (this as any)[property] = url;

        // Cache the URL
        HomeComponent.imageCache.set(imageName, url);
      },
      error: (err) => {
        console.error(`Error fetching ${imageName} image:`, err);
      }
    });
  }

}
