import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY  = 'hb_user';

  private tokenUrl = `${environment.keycloakUrl}/realms/${environment.keycloakRealm}/protocol/openid-connect/token`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type',    'password');
    body.set('client_id',     environment.keycloakClientId);
    body.set('username',      username);
    body.set('password',      password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      tap(res => {
        this.saveToken(res.access_token);
        this.saveUserName(username);
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    return localStorage.getItem(this.USER_KEY) || 'Administrador';
  }

  saveUserName(name: string): void {
    localStorage.setItem(this.USER_KEY, name);
  }
}
