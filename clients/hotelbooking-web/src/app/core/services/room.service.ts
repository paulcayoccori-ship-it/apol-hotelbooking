import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private url = `${environment.apiUrl}/api/v1/rooms`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.url);
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.url}/${id}`);
  }

  getAvailable(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.url}/available`);
  }

  create(room: Room): Observable<Room> {
    return this.http.post<Room>(this.url, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.url}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
