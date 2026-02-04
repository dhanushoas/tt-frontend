import { Component } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  imageName: string = '';
  location: string = '';
  fileToUpload: File | null = null;

  constructor(private imageService: ImageService) {}

  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  uploadImage() {
    if (!this.fileToUpload || !this.imageName || !this.location) {
      console.error('Please provide all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.fileToUpload);
    formData.append('name', this.imageName);
    formData.append('location', this.location);

    this.imageService.uploadImage(formData).subscribe(
      response => {
        console.log(response);
        alert('Image uploaded successfully: ' + response.message);
        this.imageName = '';
        this.location = '';
      },
      error => {
        console.error(error);
        alert('Error uploading image!');
      }
    );
  }
}
