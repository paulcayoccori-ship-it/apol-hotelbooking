import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-public-rooms',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule],
  templateUrl: './public-rooms.component.html'
})
export class PublicRoomsComponent implements OnInit {
  rooms:    Room[] = [];
  filtered: Room[] = [];
  loading = false;
  error   = '';
  filterType   = '';
  filterStatus = 'AVAILABLE';

  readonly roomTypes = ['', 'SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];

  constructor(private svc: RoomService) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => {
        this.rooms   = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error   = 'No se pudo cargar las habitaciones.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.rooms.filter(r => {
      const matchType   = !this.filterType   || r.type   === this.filterType;
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      return matchType && matchStatus;
    });
  }
}
