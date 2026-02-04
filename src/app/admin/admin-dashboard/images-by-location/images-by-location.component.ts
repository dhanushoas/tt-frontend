import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageService } from '../image-upload/image.service';

@Component({
  selector: 'app-images-by-location',
  templateUrl: './images-by-location.component.html',
  styleUrls: ['./images-by-location.component.css']
})
export class ImagesByLocationComponent {
  location: string = '';
  images: any[] = [];
  fileToUpload: File | null = null;
  imageName: string = '';

  constructor(private imageService: ImageService) {}

  getImagesByLocation() {
    if (!this.location) {
      console.error('Please provide a location!');
      return;
    }

    this.imageService.getImagesByLocation(this.location).subscribe(
      response => {
        console.log(response);
        this.images = response;
      },
      error => {
        console.error(error);
        alert('Error fetching images by location!');
      }
    );
  }

  getImageUrl(imageName: string) {
    return `${this.imageService.baseUrl}/images/${imageName}`;
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
        if (response instanceof HttpErrorResponse) {
          console.error(response.error);
          alert('Error uploading image: ' + response.error);
        } else {
          console.log(response);
          alert('Image uploaded successfully!');
          this.getImagesByLocation();
        }
      },
      error => {
        console.error(error);
        alert('Error uploading image!');
      }
    );
  }

  deleteImage(imageName: string) {
    this.imageService.deleteImage(imageName).subscribe(
      response => {
        console.log(response);
        alert('Image deleted successfully!');
        // Remove the deleted image from the images array
        this.images = this.images.filter(image => image.name !== imageName);
      },
      error => {
        console.error(error);
        alert('Error deleting image!');
      }
    );
}


  updateImage(image: any) {
    const newName = prompt('Enter new name:', image.name);
    const newLocation = prompt('Enter new location:', image.location);
  
    if (newName && newLocation) {
      this.imageService.updateImage(image.name, newName, newLocation).subscribe(
        response => {
          console.log(response);
          alert('Image updated successfully!');
          this.getImagesByLocation();
        },
        error => {
          console.error(error);
          alert('Error updating image!');
        }
      );
    } else {
      alert('Please provide both name and location!');
    }
  }
}
