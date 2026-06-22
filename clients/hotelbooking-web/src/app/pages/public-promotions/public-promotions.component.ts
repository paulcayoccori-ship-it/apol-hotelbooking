import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { RoomService } from '../../core/services/room.service';
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

  constructor(private svc: RoomService) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: rooms => {
        this.promotions = rooms.filter(r => r.promotionActive);
        this.loading    = false;
      },
      error: () => { this.error = 'No se pudo cargar las promociones.'; this.loading = false; }
    });
  }
}
