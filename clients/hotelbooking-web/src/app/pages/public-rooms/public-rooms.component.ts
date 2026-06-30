import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../core/services/room.service';
import { ClientAuthService } from '../../core/services/client-auth.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-public-rooms',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './public-rooms.component.html'
})
export class PublicRoomsComponent implements OnInit {
  rooms:    Room[] = [];
  filtered: Room[] = [];
  loading = false;
  error   = '';
  filterType = '';

  readonly roomTypes = ['', 'SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];

  constructor(
    private svc: RoomService,
    private clientAuth: ClientAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => {
        this.rooms   = data.filter(r => r.status === 'AVAILABLE');
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error   = 'No se pudo cargar las habitaciones.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filtered = this.rooms.filter(r =>
      !this.filterType || r.type === this.filterType
    );
  }

  reservar(roomId: number): void {
    if (this.clientAuth.isLoggedIn()) {
      this.router.navigate(['/booking', roomId]);
    } else {
      this.clientAuth.savePendingBooking(roomId);
      this.router.navigate(['/client-login'], { queryParams: { redirect: `/booking/${roomId}` } });
    }
  }
}
