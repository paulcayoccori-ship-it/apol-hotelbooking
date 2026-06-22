import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  available:   Room[] = [];
  promotions:  Room[] = [];
  loading = false;

  constructor(private roomSvc: RoomService) {}

  ngOnInit(): void {
    this.loading = true;
    this.roomSvc.getAll().subscribe({
      next: rooms => {
        this.available  = rooms.filter(r => r.status === 'AVAILABLE').slice(0, 6);
        this.promotions = rooms.filter(r => r.promotionActive).slice(0, 4);
        this.loading    = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
