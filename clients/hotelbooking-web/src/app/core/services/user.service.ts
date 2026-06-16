import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
