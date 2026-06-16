import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;
  editId: number | null = null;

  form = new FormGroup({
    userId: new FormControl<number | null>(null, Validators.required),
    roomId: new FormControl<number | null>(null, Validators.required),
    checkInDate: new FormControl('', Validators.required),
    checkOutDate: new FormControl('', Validators.required),
    totalAmount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    status: new FormControl('PENDING', Validators.required)
  });

  constructor(private svc: BookingService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.bookings = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.editId = null;
    this.form.reset({ status: 'PENDING', totalAmount: 0 });
    this.showModal = true;
  }

  openEdit(b: Booking): void {
    this.editId = b.id!;
    this.form.patchValue(b);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const body = this.form.value as Booking;
    const obs$ = this.editId ? this.svc.update(this.editId, body) : this.svc.create(body);
    obs$.subscribe({
      next: () => { this.success = this.editId ? 'Reserva actualizada.' : 'Reserva creada.'; this.closeModal(); this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  confirm(id: number): void {
    if (!confirm('¿Confirmar esta reserva?')) return;
    this.svc.confirm(id).subscribe({
      next: () => { this.success = 'Reserva confirmada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  cancel(id: number): void {
    if (!confirm('¿Cancelar esta reserva?')) return;
    this.svc.cancel(id).subscribe({
      next: () => { this.success = 'Reserva cancelada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta reserva?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success = 'Reserva eliminada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  closeModal(): void { this.showModal = false; }

  errMsg(e: any): string {
    if (!e.status) return 'No se pudo conectar con el servidor.';
    if (e.status === 403) return 'No tiene permisos.';
    if (e.status === 500) return 'Error interno del servidor.';
    return e.error?.message || 'Error inesperado.';
  }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }

  get editMode(): boolean { return this.editId !== null; }
}
