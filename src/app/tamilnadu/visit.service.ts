// visit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../user/user.service';


import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  getLoggedInUser() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  getData(location: string): Observable<any> {
    const url = `${this.apiUrl}/image/getImages/${location}`;
    return this.http.get(url);
  }


  storeSelectedPlaces(data: { username: string | null; location: string; selectedPlaces: string[] }): Observable<any> {
    const { username, location, selectedPlaces } = data;
    const url = `${this.apiUrl}/api/visits/store`;

    if (username) {
      return this.http.post(url, { username, location, selectedPlaces }).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
    } else {
      return throwError('User not logged in.');
    }
  }

  getAllSelectedPlaces(): Observable<any> {
    const loggedInUsername = this.userService.getLoggedInUser();
    const url = loggedInUsername
      ? `${this.apiUrl}/api/visits/getall?username=${encodeURIComponent(loggedInUsername)}`
      : `${this.apiUrl}/api/visits/getall`;

    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  removeSelectedPlace(placeName: string): Observable<any> {
    const username = this.userService.getLoggedInUser();

    if (username) {
      const url = `${this.apiUrl}/api/visits/remove`;
      return this.http.post(url, { username, place: placeName }).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
    } else {
      return throwError('User not logged in.');
    }
  }

  getSelectedPlaceCount(): Observable<number> {
    const username = this.userService.getLoggedInUser();
    if (username) {
      const url = `${this.apiUrl}/api/visits/count?username=${username}`;
      return this.http.get<number>(url).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
    } else {
      return throwError('User not logged in.');
    }
  }

  deleteSelectedPlaces(username: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/visits/selected-places/${username}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }
}
