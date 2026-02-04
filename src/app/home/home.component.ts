import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../tamilnadu/visit.service';
import { ImageService } from '../admin/admin-dashboard/image-upload/image.service';

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

  constructor(private router: Router, private visitService: VisitService, private imageService: ImageService) { }

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
            alert('No districts found. Choose another district name.');
          }
        },
        error: (error: any) => {
          console.error('Error checking images:', error);
          alert('No districts found. Choose another district name.');
        }
      });

    } else {
      alert('Please enter a district name.');
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

  ngOnInit(): void {
    this.fetchImage('tamilnadu', 'tamilnaduImage');
    this.fetchImage('temple', 'templeImage');
    this.fetchImage('education', 'educationImage');
    this.fetchImage('honeymoon', 'honeymoonImage');
    this.fetchImage('mountain', 'mountainImage');
    this.fetchImage('party', 'partyImage');
    this.fetchImage('beach', 'beachImage');
    this.fetchImage('kanyakumari', 'kanyakumariImage');
    this.fetchImage('kodaikanal', 'kodaikanalImage');
    this.fetchImage('mahapalipuram', 'mahapalipuramImage');
    this.fetchImage('samayapuram', 'samayapuramImage');
    this.fetchImage('srirangam', 'srirangamImage');
  }

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
