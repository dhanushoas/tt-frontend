import { Component, OnInit } from '@angular/core';
import { ImageService } from '../admin/admin-dashboard/image-upload/image.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  aboutUsImage: string = ''; 

  constructor(private imageService: ImageService) {} 

  ngOnInit(): void {
    this.fetchImage('about-us', 'aboutUsImage');
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
