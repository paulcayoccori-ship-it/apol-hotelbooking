import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RoomService } from '../../core/services/room.service';
import { BookingService } from '../../core/services/booking.service';
import { ClientAuthService } from '../../core/services/client-auth.service';
import { Client } from '../../core/models/client.model';
import { Room } from '../../core/models/room.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './public-booking.component.html'
})
export class PublicBookingComponent implements OnInit {
  room:   Room | null   = null;
  client: Client | null = null;
  loading = false;
  saving  = false;
  error   = '';

  form = new FormGroup({
    checkInDate:    new FormControl('', Validators.required),
    checkOutDate:   new FormControl('', Validators.required),
    numberOfPeople: new FormControl<number>(1, [Validators.required, Validators.min(1)])
  });

  today = new Date().toISOString().split('T')[0];

  constructor(
    private route:      ActivatedRoute,
    private router:     Router,
    private roomSvc:    RoomService,
    private bookSvc:    BookingService,
    private clientAuth: ClientAuthService,
    private cdr:        ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.client = this.clientAuth.getClient();

    const idParam = this.route.snapshot.paramMap.get('roomId');
    console.log('[PublicBooking] ID recibido desde ruta:', idParam);

    if (!idParam) {
      this.loading = false;
      this.error = 'No se recibió el ID de la habitación.';
      return;
    }

    const roomId = Number(idParam);
    if (isNaN(roomId) || roomId <= 0) {
      this.loading = false;
      this.error = 'ID de habitación inválido.';
      return;
    }

    console.log('[PublicBooking] URL consultada:', `${environment.apiUrl}/api/v1/rooms/${roomId}`);
    this.loading = true;
    this.roomSvc.getById(roomId).subscribe({
      next: r => {
        console.log('[PublicBooking] Habitación cargada:', r);
        this.room    = r;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('[PublicBooking] Error al cargar habitación:', err);
        this.error   = 'No se pudo cargar la habitación seleccionada.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goLogin(): void {
    if (this.room) {
      this.clientAuth.savePendingBooking(this.room.id!);
    }
    this.router.navigate(['/client-login']);
  }

  goRegister(): void {
    if (this.room) {
      this.clientAuth.savePendingBooking(this.room.id!);
    }
    this.router.navigate(['/client-register']);
  }

  submit(): void {
    if (this.form.invalid || !this.room || !this.client) return;
    this.saving = true;
    this.error  = '';

    const { checkInDate, checkOutDate } = this.form.value;

    const nights = this.calcNights(checkInDate!, checkOutDate!);
    const price  = this.room.promotionActive && this.room.promotionPrice
      ? this.room.promotionPrice
      : this.room.pricePerNight;
    const total  = price * nights;

    this.bookSvc.create({
      userId:       this.client.id,
      roomId:       this.room.id!,
      checkInDate:  checkInDate!,
      checkOutDate: checkOutDate!,
      totalAmount:  total,
      status:       'PENDING'
    }).subscribe({
      next: booking => {
        this.saving = false;
        this.router.navigate(['/payment', booking.id]);
      },
      error: () => {
        this.saving = false;
        this.error  = 'No se pudo completar la reserva. Intenta nuevamente.';
      }
    });
  }

  calcNights(checkIn: string, checkOut: string): number {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  get effectivePrice(): number {
    if (!this.room) return 0;
    return this.room.promotionActive && this.room.promotionPrice
      ? this.room.promotionPrice
      : this.room.pricePerNight;
  }

  get estimatedTotal(): number {
    const ci = this.form.value.checkInDate;
    const co = this.form.value.checkOutDate;
    if (!ci || !co) return 0;
    return this.effectivePrice * this.calcNights(ci, co);
  }
}
