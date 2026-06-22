import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { Payment } from '../../core/models/payment.model';

@Component({
  selector: 'app-public-payment',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './public-payment.component.html'
})
export class PublicPaymentComponent implements OnInit {
  booking:  Booking | null  = null;
  payment:  Payment | null  = null;
  loading = false;
  saving  = false;
  error   = '';
  done    = false;

  readonly methods = ['CASH', 'CARD', 'YAPE', 'PLIN', 'TRANSFER'];

  form = new FormGroup({
    paymentMethod:   new FormControl('YAPE',  Validators.required),
    amount:          new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    transactionCode: new FormControl('')
  });

  constructor(
    private route:      ActivatedRoute,
    private router:     Router,
    private paySvc:     PaymentService,
    private bookSvc:    BookingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.loading = true;
    this.bookSvc.getById(id).subscribe({
      next: b => {
        this.booking = b;
        this.form.patchValue({ amount: b.totalAmount });
        this.loading = false;
      },
      error: () => { this.error = 'Reserva no encontrada.'; this.loading = false; }
    });
  }

  pay(): void {
    if (this.form.invalid || !this.booking) return;
    this.saving = true;
    this.error  = '';

    const { paymentMethod, amount, transactionCode } = this.form.value;

    this.paySvc.create({
      bookingId:       this.booking.id!,
      amount:          amount!,
      paymentMethod:   paymentMethod!,
      status:          'PENDING',
      transactionCode: transactionCode || ''
    }).subscribe({
      next: pay => {
        this.paySvc.confirm(pay.id!).subscribe({
          next: confirmed => { this.payment = confirmed; this.saving = false; this.done = true; },
          error: () => { this.saving = false; this.error = 'Pago creado pero no se pudo confirmar.'; }
        });
      },
      error: () => { this.saving = false; this.error = 'No se pudo procesar el pago.'; }
    });
  }
}
