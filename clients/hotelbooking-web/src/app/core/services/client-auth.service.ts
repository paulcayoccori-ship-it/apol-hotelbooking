import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientLoginPayload, ClientRegisterPayload } from '../models/client.model';

const STORAGE_KEY = 'client_user';
const PENDING_BOOKING_KEY = 'pending_booking_roomId';

@Injectable({ providedIn: 'root' })
export class ClientAuthService {
  private readonly base = `${environment.apiUrl}/api/v1/users/client`;

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: ClientRegisterPayload): Observable<Client> {
    return this.http.post<Client>(`${this.base}/register`, payload).pipe(
      tap(client => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
        this.redirectAfterAuth();
      })
    );
  }

  login(payload: ClientLoginPayload): Observable<Client> {
    return this.http.post<Client>(`${this.base}/login`, payload).pipe(
      tap(client => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
        this.redirectAfterAuth();
      })
    );
  }

  getClient(): Client | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getClient();
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Guarda el roomId antes de redirigir al login/registro */
  savePendingBooking(roomId: number | string): void {
    localStorage.setItem(PENDING_BOOKING_KEY, String(roomId));
  }

  clearPendingBooking(): void {
    localStorage.removeItem(PENDING_BOOKING_KEY);
  }

  getPendingBookingRoomId(): string | null {
    return localStorage.getItem(PENDING_BOOKING_KEY);
  }

  private redirectAfterAuth(): void {
    const roomId = this.getPendingBookingRoomId();
    if (roomId) {
      this.clearPendingBooking();
      this.router.navigate(['/booking', roomId]);
    } else {
      this.router.navigate(['/rooms']);
    }
  }
}
