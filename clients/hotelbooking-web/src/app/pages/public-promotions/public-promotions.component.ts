import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { RoomService } from '../../core/services/room.service';
import { ClientAuthService } from '../../core/services/client-auth.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-public-promotions',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './public-promotions.component.html'
})
export class PublicPromotionsComponent implements OnInit {
  promotions: Room[] = [];
  loading = false;
  error   = '';

  constructor(
    private svc: RoomService,
    private clientAuth: ClientAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: rooms => {
        this.promotions = rooms.filter(r => r.promotionActive);
        this.loading    = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error   = 'No se pudo cargar las promociones.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reservar(roomId: number): void {
    if (this.clientAuth.isLoggedIn()) {
      this.router.navigate(['/booking', roomId]);
    } else {
      this.clientAuth.savePendingBooking(roomId);
      this.router.navigate(['/client-login']);
    }
  }
}
