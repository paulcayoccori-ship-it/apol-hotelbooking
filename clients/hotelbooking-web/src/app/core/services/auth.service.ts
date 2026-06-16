import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hb_token';
  private readonly USER_KEY = 'hb_user';

  constructor(private router: Router) {}

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
