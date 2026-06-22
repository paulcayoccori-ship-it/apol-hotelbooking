import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';
import { apiErrMsg } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;

  readonly types = ['BOOKING_CONFIRMATION', 'PAYMENT_CONFIRMATION', 'CANCELLATION', 'REMINDER', 'GENERAL'];
  readonly channels = ['EMAIL', 'SMS', 'PUSH', 'WHATSAPP'];

  form = new FormGroup({
    userId: new FormControl<number | null>(null, Validators.required),
    bookingId: new FormControl<number | null>(null),
    type: new FormControl('GENERAL', Validators.required),
    channel: new FormControl('EMAIL', Validators.required),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  });

  constructor(private svc: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.notifications = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.form.reset({ type: 'GENERAL', channel: 'EMAIL' });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    this.svc.create(this.form.value as Notification).subscribe({
      next: () => { this.success = 'Notificación creada.'; this.showModal = false; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  send(id: number): void {
    if (!confirm('¿Enviar esta notificación?')) return;
    this.svc.send(id).subscribe({
      next: () => { this.success = 'Notificación enviada.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  errMsg(e: any): string { return apiErrMsg(e); }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }
}
