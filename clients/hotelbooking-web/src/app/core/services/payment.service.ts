import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = `${environment.apiUrl}/api/v1/payments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.url);
  }

  create(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.url, payment);
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.url}/${id}`);
  }

  confirm(id: number): Observable<Payment> {
    return this.http.patch<Payment>(`${this.url}/${id}/confirm`, {});
  }

  fail(id: number): Observable<Payment> {
    return this.http.patch<Payment>(`${this.url}/${id}/fail`, {});
  }
}
