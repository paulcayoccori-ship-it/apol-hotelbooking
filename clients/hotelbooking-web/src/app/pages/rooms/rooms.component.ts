import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;
  editId: number | null = null;

  readonly roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];
  readonly statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  form = new FormGroup({
    roomNumber: new FormControl('', Validators.required),
    type: new FormControl('SINGLE', Validators.required),
    description: new FormControl(''),
    pricePerNight: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    capacity: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    status: new FormControl('AVAILABLE', Validators.required)
  });

  constructor(private svc: RoomService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next: d => { this.rooms = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.editId = null;
    this.form.reset({ type: 'SINGLE', status: 'AVAILABLE', pricePerNight: 0, capacity: 1 });
    this.showModal = true;
  }

  openEdit(r: Room): void {
    this.editId = r.id!;
    this.form.patchValue(r);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const body = this.form.value as Room;
    const obs$ = this.editId ? this.svc.update(this.editId, body) : this.svc.create(body);
    obs$.subscribe({
      next: () => { this.success = this.editId ? 'Habitación actualizada.' : 'Habitación creada.'; this.closeModal(); this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta habitación?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success = 'Habitación eliminada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  closeModal(): void { this.showModal = false; }

  errMsg(e: any): string {
    if (!e.status) return 'No se pudo conectar con el servidor.';
    if (e.status === 403) return 'No tiene permisos para esta acción.';
    if (e.status === 500) return 'Error interno del servidor.';
    return e.error?.message || 'Error inesperado.';
  }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }

  get editMode(): boolean { return this.editId !== null; }
}
