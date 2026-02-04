import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  baseUrl: string = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData) {
    return this.http.post<any>(`${this.baseUrl}/upload`, formData);
  }

  getImagesByLocation(location: string) {
    return this.http.get<any[]>(`${this.baseUrl}/getImages/${location}`);
  }

  getImageByName(imageName: string) {
    return this.http.get(`${this.baseUrl}/getImageByName/${imageName}`, { responseType: 'blob' });
  }

  updateImage(imageName: string, newName: string, newLocation: string) {
    return this.http.put<any>(`${this.baseUrl}/images/${imageName}`, { newName, newLocation });
  }

  deleteImage(imageName: string) {
    return this.http.delete(`${this.baseUrl}/images/${imageName}`);
  }
}
