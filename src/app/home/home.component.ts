import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../tamilnadu/visit.service';
import { ImageService } from '../admin/admin-dashboard/image-upload/image.service';
import { ToastService } from '../toast.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  topRatedPackages = [
    {
      name: 'Marinabeach',
      location: 'Chennai',
      district: 'chennai',
      category: 'COASTAL',
      description: "India's longest and world's second longest beach along the Bay of Bengal.",
      rating: 4.9,
      imageKey: 'beach'
    },
    {
      name: 'Kanyakumari',
      location: 'Kanyakumari',
      district: 'kanyakumari',
      category: 'LANDS END',
      description: 'The only place in India where you can observe sunrise and sunset at the same beach.',
      rating: 4.8,
      imageKey: 'kanyakumari'
    },
    {
      name: 'Kodaikanal',
      location: 'Dindigul',
      district: 'dindigul',
      category: 'HILL STATION',
      description: 'One of the very popular holiday destination hill resorts in South India.',
      rating: 4.7,
      imageKey: 'kodaikanal'
    },
    {
      name: 'Mahapalipuram',
      location: 'Chengalpattu',
      district: 'chengalpattu',
      category: 'HERITAGE',
      description: 'The World Heritage Site of 7th- and 8th-century Hindu Group of Monuments.',
      rating: 4.9,
      imageKey: 'mahapalipuram'
    },
    {
      name: 'Srirangam Temple',
      location: 'Tiruchirappalli',
      district: 'tiruchirappalli',
      category: 'SPIRITUAL',
      description: 'The largest functioning Hindu temple in the world with stunning architecture.',
      rating: 4.9,
      imageKey: 'srirangam'
    },
    {
      name: 'Ooty Lake',
      location: 'Nilgiris',
      district: 'nilgiris',
      category: 'NATURE',
      description: 'An artificial lake located in the heart of Ooty, surrounded by Nilgiri hills.',
      rating: 4.8,
      imageKey: 'ooty_lake'
    }
  ];

  constructor(private router: Router,
    private visitService: VisitService,
    private imageService: ImageService,
    private toastService: ToastService,
    public langService: LanguageService) { }

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

  // Carousel related properties
  carouselImages: any = {};
  currentScrollPosition: number = 0;

  private static imageCache = new Map<string, string>();

  ngOnInit(): void {
    this.loadImage('tamilnadu', 'tamilnaduImage');
    this.loadImage('temple', 'templeImage');
    this.loadImage('education', 'educationImage');
    this.loadImage('honeymoon', 'honeymoonImage');
    this.loadImage('mountain', 'mountainImage');
    this.loadImage('party', 'partyImage');

    // Load top rated images
    this.topRatedPackages.forEach(pkg => {
      this.loadImage(pkg.imageKey, pkg.imageKey as any, true);
    });
  }

  loadImage(imageName: string, property: keyof this, isCarousel: boolean = false) {
    if (HomeComponent.imageCache.has(imageName)) {
      const url = HomeComponent.imageCache.get(imageName);
      if (isCarousel) {
        this.carouselImages[imageName] = url;
      } else {
        (this as any)[property] = url;
      }
      return;
    }

    this.imageService.getImageByName(imageName).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: response.type });
        const url = URL.createObjectURL(blob);
        if (isCarousel) {
          this.carouselImages[imageName] = url;
        } else {
          (this as any)[property] = url;
        }
        HomeComponent.imageCache.set(imageName, url);
      },
      error: (err) => {
        console.error(`Error fetching ${imageName} image:`, err);
      }
    });
  }

  scrollCarousel(direction: 'left' | 'right') {
    const container = document.querySelector('.carousel-track') as HTMLElement;
    if (!container) return;

    const scrollAmount = 350; // Approximated card width + gap
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
