import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { RoomService } from '../../core/services/room.service';
import { UserService } from '../../core/services/user.service';
import { BookingService } from '../../core/services/booking.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './public-booking.component.html'
})
export class PublicBookingComponent implements OnInit {
  room: Room | null = null;
  loading  = false;
  saving   = false;
  error    = '';
  success  = '';

  form = new FormGroup({
    fullName:   new FormControl('', Validators.required),
    email:      new FormControl('', [Validators.required, Validators.email]),
    phone:      new FormControl('', Validators.required),
    checkInDate:  new FormControl('', Validators.required),
    checkOutDate: new FormControl('', Validators.required),
    numberOfPeople: new FormControl<number>(1, [Validators.required, Validators.min(1)])
  });

  today = new Date().toISOString().split('T')[0];

  constructor(
    private route:   ActivatedRoute,
    private router:  Router,
    private roomSvc: RoomService,
    private userSvc: UserService,
    private bookSvc: BookingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('roomId'));
    this.loading = true;
    this.roomSvc.getById(id).subscribe({
      next: r  => { this.room = r; this.loading = false; },
      error: () => { this.error = 'Habitación no encontrada.'; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid || !this.room) return;
    this.saving = true;
    this.error  = '';

    const { fullName, email, phone, checkInDate, checkOutDate } = this.form.value;

    const nights = this.calcNights(checkInDate!, checkOutDate!);
    const price  = this.room.promotionActive && this.room.promotionPrice
      ? this.room.promotionPrice
      : this.room.pricePerNight;
    const total  = price * nights;

    this.userSvc.create({
      fullName: fullName!,
      email:    email!,
      phone:    phone!,
      role:     'CUSTOMER',
      enabled:  true
    }).pipe(
      switchMap(user => this.bookSvc.create({
        userId:       user.id!,
        roomId:       this.room!.id!,
        checkInDate:  checkInDate!,
        checkOutDate: checkOutDate!,
        totalAmount:  total,
        status:       'PENDING'
      }))
    ).subscribe({
      next: booking => {
        this.saving = false;
        this.router.navigate(['/payment', booking.id]);
      },
      error: () => {
        this.saving = false;
        this.error  = 'No se pudo completar la reserva. Verifique que el Gateway esté activo en http://localhost:7091';
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
