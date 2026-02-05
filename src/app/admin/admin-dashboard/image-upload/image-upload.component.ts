import { Component } from '@angular/core';
import { ImageService } from './image.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  imageName: string = '';
  location: string = '';
  fileToUpload: File | null = null;
  isUploading: boolean = false;
  validationMessage: string = '';
  isFormValid: boolean = false;

  constructor(private imageService: ImageService, private toastService: ToastService) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastService.show('Please select a valid image file', 'warning');
        return;
      }
      this.fileToUpload = file;
      this.onValueChange();
    }
  }

  onValueChange() {
    this.validationMessage = '';
    if (!this.fileToUpload) {
      this.isFormValid = false;
      return;
    }
    if (this.imageName.length < 3) {
      this.validationMessage = 'Image name must be at least 3 characters';
      this.isFormValid = false;
      return;
    }
    if (this.location.length < 3) {
      this.validationMessage = 'Location name must be at least 3 characters';
      this.isFormValid = false;
      return;
    }
    this.isFormValid = true;
  }

  uploadImage() {
    if (!this.isFormValid || !this.fileToUpload) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('image', this.fileToUpload);
    formData.append('name', this.imageName);
    formData.append('location', this.location);

    this.imageService.uploadImage(formData).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.toastService.show('Image uploaded successfully!', 'success');
        this.resetForm();
      },
      error: (error) => {
        this.isUploading = false;
        console.error(error);
        const errorMsg = error.error?.message || 'Error uploading image!';
        this.toastService.show(errorMsg, 'danger');
      }
    });
  }

  private resetForm() {
    this.imageName = '';
    this.location = '';
    this.fileToUpload = null;
    this.isFormValid = false;
    this.validationMessage = '';
  }
}
