import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../book.service'; // Assuming you have a Book interface defined

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiUrl; // Update with your server base URL

  constructor(private http: HttpClient) { }

  makePayment(paymentDetails: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pay/api/payments`, paymentDetails);
  }

  getPaidIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/pay/api/payments/paidIds`);
  }

  getAllPayments(): Observable<any> {
    const url = `${this.baseUrl}/pay/api/payments/all`;

    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }
}
