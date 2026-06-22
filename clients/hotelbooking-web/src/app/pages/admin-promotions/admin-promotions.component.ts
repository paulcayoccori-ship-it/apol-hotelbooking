import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';
import { apiErrMsg } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, NgClass],
  templateUrl: './admin-promotions.component.html'
})
export class AdminPromotionsComponent implements OnInit {
  rooms:   Room[] = [];
  loading  = false;
  saving   = false;
  error    = '';
  success  = '';
  showModal    = false;
  selectedRoom: Room | null = null;

  form = new FormGroup({
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
    this.svc.getAll().subscribe({
      next: d => { this.rooms = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openModal(r: Room): void {
    this.selectedRoom = r;
    this.form.patchValue({
      promotionActive:      r.promotionActive ?? false,
      promotionTitle:       r.promotionTitle       || '',
      promotionDescription: r.promotionDescription || '',
      discountPercent:      r.discountPercent       ?? 0,
      promotionPrice:       r.promotionPrice        ?? 0
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid || !this.selectedRoom) return;
    this.saving = true;
    const updated: Room = {
      ...this.selectedRoom,
      promotionActive:      this.form.value.promotionActive      ?? false,
      promotionTitle:       this.form.value.promotionTitle       || '',
      promotionDescription: this.form.value.promotionDescription || '',
      discountPercent:      this.form.value.discountPercent      ?? 0,
      promotionPrice:       this.form.value.promotionPrice       ?? 0
    };
    this.svc.update(this.selectedRoom.id!, updated).subscribe({
      next: () => {
        this.success = 'Promoción guardada.';
        this.saving = false; this.showModal = false; this.load(); this.autoClear();
      },
      error: e => { this.error = this.errMsg(e); this.saving = false; }
    });
  }

  deactivate(r: Room): void {
    if (!confirm('¿Desactivar promoción de esta habitación?')) return;
    const updated: Room = { ...r, promotionActive: false, promotionTitle: '', discountPercent: 0, promotionPrice: 0 };
    this.svc.update(r.id!, updated).subscribe({
      next: () => { this.success = 'Promoción desactivada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  closeModal(): void { this.showModal = false; }

  errMsg(e: any): string { return apiErrMsg(e); }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }

  get activePromos(): Room[]  { return this.rooms.filter(r => r.promotionActive); }
  get withoutPromo(): Room[]  { return this.rooms.filter(r => !r.promotionActive); }
}
