import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { RoomService } from '../../core/services/room.service';
import { BookingService } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { NotificationService } from '../../core/services/notification.service';

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  sublabel?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = true;
  error = '';
  cards: StatCard[] = [];

  constructor(
    private userSvc: UserService,
    private roomSvc: RoomService,
    private bookingSvc: BookingService,
    private paymentSvc: PaymentService,
    private notifSvc: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      users: this.userSvc.getAll().pipe(catchError(() => of([]))),
      rooms: this.roomSvc.getAll().pipe(catchError(() => of([]))),
      available: this.roomSvc.getAvailable().pipe(catchError(() => of([]))),
      bookings: this.bookingSvc.getAll().pipe(catchError(() => of([]))),
      payments: this.paymentSvc.getAll().pipe(catchError(() => of([]))),
      notifications: this.notifSvc.getAll().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ users, rooms, available, bookings, payments, notifications }) => {
        const pendingBookings = (bookings as any[]).filter(b => b.status === 'PENDING').length;
        const confirmedPayments = (payments as any[]).filter(p => p.status === 'CONFIRMED').length;
        const sentNotifs = (notifications as any[]).filter(n => n.status === 'SENT').length;

        this.cards = [
          { label: 'Total Usuarios', value: (users as any[]).length, icon: '&#128101;', color: '#3b82f6' },
          { label: 'Total Habitaciones', value: (rooms as any[]).length, icon: '&#127968;', color: '#8b5cf6', sublabel: `${(available as any[]).length} disponibles` },
          { label: 'Total Reservas', value: (bookings as any[]).length, icon: '&#128197;', color: '#f59e0b', sublabel: `${pendingBookings} pendientes` },
          { label: 'Pagos Realizados', value: confirmedPayments, icon: '&#128179;', color: '#10b981', sublabel: `de ${(payments as any[]).length} registrados` },
          { label: 'Notificaciones Enviadas', value: sentNotifs, icon: '&#128276;', color: '#ef4444', sublabel: `de ${(notifications as any[]).length} totales` },
          { label: 'Habitaciones Disponibles', value: (available as any[]).length, icon: '&#9989;', color: '#06b6d4' }
        ];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo conectar con el servidor. Verifica que el Gateway esté corriendo.';
        this.loading = false;
      }
    });
  }
}
