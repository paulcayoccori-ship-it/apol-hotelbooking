import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { apiErrMsg } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, NgClass],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  error   = '';
  success = '';
  showModal       = false;
  showPromoModal  = false;
  editId: number | null = null;
  promoRoomId: number | null = null;
  imagePreview: string | null = null;

  readonly roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];
  readonly statuses  = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'];

  form = new FormGroup({
    roomNumber:   new FormControl('',        Validators.required),
    type:         new FormControl('SINGLE',  Validators.required),
    description:  new FormControl(''),
    pricePerNight: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    capacity:     new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    status:       new FormControl('AVAILABLE', Validators.required),
    imageUrl:     new FormControl('')
  });

  promoForm = new FormGroup({
    promotionActive:      new FormControl(true),
    promotionTitle:       new FormControl('', Validators.required),
    promotionDescription: new FormControl(''),
    discountPercent:      new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    promotionPrice:       new FormControl<number>(0, Validators.required)
  });

  constructor(private svc: RoomService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error   = '';
    this.svc.getAll().subscribe({
      next:  d => { this.rooms = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.editId      = null;
    this.imagePreview = null;
    this.form.reset({ type: 'SINGLE', status: 'AVAILABLE', pricePerNight: 0, capacity: 1 });
    this.showModal = true;
  }

  openEdit(r: Room): void {
    this.editId       = r.id!;
    this.imagePreview = r.imageUrl || null;
    this.form.patchValue({
      roomNumber:    r.roomNumber,
      type:          r.type,
      description:   r.description,
      pricePerNight: r.pricePerNight,
      capacity:      r.capacity,
      status:        r.status,
      imageUrl:      r.imageUrl || ''
    });
    this.showModal = true;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.imagePreview = base64;
      this.form.patchValue({ imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.form.invalid) return;
    const body = this.form.value as Room;
    const obs$ = this.editId ? this.svc.update(this.editId, body) : this.svc.create(body);
    obs$.subscribe({
      next: () => {
        this.success = this.editId ? 'Habitación actualizada.' : 'Habitación creada.';
        this.closeModal(); this.load(); this.autoClear();
      },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta habitación?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success = 'Habitación eliminada.'; this.load(); this.autoClear(); },
      error: e  => { this.error = this.errMsg(e); }
    });
  }

  openPromo(r: Room): void {
    this.promoRoomId = r.id!;
    this.promoForm.patchValue({
      promotionActive:      r.promotionActive ?? true,
      promotionTitle:       r.promotionTitle   || '',
      promotionDescription: r.promotionDescription || '',
      discountPercent:      r.discountPercent  ?? 0,
      promotionPrice:       r.promotionPrice   ?? 0
    });
    this.showPromoModal = true;
  }

  savePromo(): void {
    if (this.promoForm.invalid || !this.promoRoomId) return;
    const room = this.rooms.find(r => r.id === this.promoRoomId);
    if (!room) return;

    const updated: Room = {
      ...room,
      promotionActive:      this.promoForm.value.promotionActive ?? true,
      promotionTitle:       this.promoForm.value.promotionTitle      || '',
      promotionDescription: this.promoForm.value.promotionDescription || '',
      discountPercent:      this.promoForm.value.discountPercent  ?? 0,
      promotionPrice:       this.promoForm.value.promotionPrice   ?? 0
    };

    this.svc.update(this.promoRoomId, updated).subscribe({
      next: () => {
        this.success = 'Promoción guardada.';
        this.showPromoModal = false; this.load(); this.autoClear();
      },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  closeModal():      void { this.showModal      = false; }
  closePromoModal(): void { this.showPromoModal = false; }

  errMsg(e: any): string { return apiErrMsg(e); }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }

  get editMode(): boolean { return this.editId !== null; }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      AVAILABLE:   'badge-success',
      OCCUPIED:    'badge-danger',
      MAINTENANCE: 'badge-warning',
      RESERVED:    'badge-info'
    };
    return map[status] || 'badge-secondary';
  }
}
