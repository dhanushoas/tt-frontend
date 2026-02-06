import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from './book';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllBooks(username: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/book/getall/${username}`);
  }

  getBookByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/book/getByEmail/${email}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/book/add`, book);
  }

  getBookByCustomId(customId: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/book/getByCustomId/${customId}`);
  }

  updateBook(customId: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/book/update/${customId}`, book);
  }

  removeBook(customId: string): Observable<Book> {
    return this.http.delete<Book>(`${this.baseUrl}/book/delete/${customId}`);
  }

  getAllBookings(): Observable<any> {
    const url = `${this.baseUrl}/book/bookings/all`;

    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }
}

export { Book };
