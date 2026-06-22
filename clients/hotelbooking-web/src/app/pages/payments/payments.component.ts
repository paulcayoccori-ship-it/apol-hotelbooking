import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment.model';
import { apiErrMsg } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;

  readonly methods = ['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'TRANSFER', 'YAPE', 'PLIN'];

  form = new FormGroup({
    bookingId: new FormControl<number | null>(null, Validators.required),
    amount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    paymentMethod: new FormControl('CREDIT_CARD', Validators.required),
    transactionCode: new FormControl('')
  });

  constructor(private svc: PaymentService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.payments = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.form.reset({ paymentMethod: 'CREDIT_CARD', amount: 0 });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    this.svc.create(this.form.value as Payment).subscribe({
      next: () => { this.success = 'Pago registrado.'; this.showModal = false; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  confirm(id: number): void {
    if (!confirm('¿Confirmar este pago?')) return;
    this.svc.confirm(id).subscribe({
      next: () => { this.success = 'Pago confirmado.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  fail(id: number): void {
    if (!confirm('¿Marcar como fallido?')) return;
    this.svc.fail(id).subscribe({
      next: () => { this.success = 'Pago marcado como fallido.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  errMsg(e: any): string { return apiErrMsg(e); }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }
}
