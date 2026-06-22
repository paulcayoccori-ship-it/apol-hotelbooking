import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private url = `${environment.apiUrl}/api/v1/bookings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.url);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.url}/${id}`);
  }

  create(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.url, booking);
  }

  update(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.url}/${id}`, booking);
  }

  confirm(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.url}/${id}/confirm`, {});
  }

  cancel(id: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.url}/${id}/cancel`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
