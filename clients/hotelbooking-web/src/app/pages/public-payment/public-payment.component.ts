import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { BookingService } from '../../core/services/booking.service';
import { RoomService } from '../../core/services/room.service';
import { Booking } from '../../core/models/booking.model';
import { Payment } from '../../core/models/payment.model';
import { Room } from '../../core/models/room.model';
import * as QRCode from 'qrcode';

export type PayMethod = 'CARD' | 'YAPE' | 'PLIN' | 'CASH' | 'TRANSFER';

@Component({
  selector: 'app-public-payment',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink, CommonModule],
  templateUrl: './public-payment.component.html',
  styleUrl: './public-payment.component.scss'
})
export class PublicPaymentComponent implements OnInit {
  booking:  Booking | null = null;
  room:     Room    | null = null;
  payment:  Payment | null = null;
  loading  = false;
  saving   = false;
  error    = '';
  done     = false;
  nights   = 1;

  selectedMethod: PayMethod = 'CARD';
  simMessage = '';
  simSuccess = false;
  qrDataUrl  = '';

  cardForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    cardHolder: new FormControl('', Validators.required),
    expiry:     new FormControl('', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]),
    cvv:        new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]),
  });

  codeForm = new FormGroup({
    operationCode: new FormControl('', Validators.required)
  });

  constructor(
    private route:    ActivatedRoute,
    private paySvc:   PaymentService,
    private bookSvc:  BookingService,
    private roomSvc:  RoomService,
    private cdr:      ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.loading = true;
    this.bookSvc.getById(id).subscribe({
      next: b => {
        this.booking = b;
        this.nights  = this.calcNights(b.checkInDate, b.checkOutDate);
        this.loading = false;
        this.cdr.detectChanges();
        this.loadRoom(b.roomId);
        this.buildQR(b);
      },
      error: () => {
        this.error   = 'Reserva no encontrada.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadRoom(roomId: number): void {
    this.roomSvc.getById(roomId).subscribe({
      next: r => { this.room = r; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  private buildQR(b: Booking): void {
    const text = `YAPE-HOTELBOOKING|MUNDO HOTEL|MONTO:${b.totalAmount}|RESERVA:${b.id}|CELULAR:999888777`;
    QRCode.toDataURL(text, { width: 220, margin: 2, color: { dark: '#5b21b6', light: '#ffffff' } })
      .then(url => { this.qrDataUrl = url; this.cdr.detectChanges(); })
      .catch(() => {});
  }

  select(m: PayMethod): void {
    this.selectedMethod = m;
    this.simMessage = '';
    this.simSuccess = false;
    this.codeForm.reset();
    this.cdr.detectChanges();
  }

  refresh(): void { this.cdr.detectChanges(); }

  get cardDisplay(): string {
    const n = (this.cardForm.value.cardNumber || '').replace(/\D/g, '').padEnd(16, '•');
    return `${n.slice(0,4)} ${n.slice(4,8)} ${n.slice(8,12)} ${n.slice(12,16)}`;
  }
  get holderDisplay(): string  { return (this.cardForm.value.cardHolder || 'NOMBRE DEL TITULAR').toUpperCase(); }
  get expiryDisplay(): string  { return this.cardForm.value.expiry || 'MM/AA'; }

  pay(): void {
    if (this.selectedMethod === 'CARD') {
      if (this.cardForm.invalid) { this.cardForm.markAllAsTouched(); this.cdr.detectChanges(); return; }
    } else if (this.selectedMethod !== 'CASH') {
      if (this.codeForm.invalid) { this.codeForm.markAllAsTouched(); this.cdr.detectChanges(); return; }
    }

    this.saving     = true;
    this.simMessage = '';
    this.simSuccess = false;
    this.error      = '';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.simMessage = this.successMsg();
      this.simSuccess = true;
      this.cdr.detectChanges();
      setTimeout(() => this.callBackend(), 900);
    }, 2000);
  }

  private successMsg(): string {
    const labels: Record<PayMethod, string> = {
      CARD: 'Pago con tarjeta procesado correctamente ✓',
      YAPE: 'Pago Yape confirmado correctamente ✓',
      PLIN: 'Pago Plin confirmado correctamente ✓',
      CASH: 'Reserva registrada. Pago en recepción ✓',
      TRANSFER: 'Transferencia confirmada correctamente ✓'
    };
    return labels[this.selectedMethod];
  }

  private callBackend(): void {
    const transactionCode =
      this.selectedMethod === 'CARD'     ? `CARD-SIM-${Date.now()}` :
      this.selectedMethod === 'CASH'     ? 'CASH-PRESENCIAL' :
      this.codeForm.value.operationCode  ?? '';

    this.paySvc.create({
      bookingId:       this.booking!.id!,
      amount:          this.booking!.totalAmount,
      paymentMethod:   this.selectedMethod,
      status:          'PENDING',
      transactionCode
    }).subscribe({
      next: pay => {
        this.paySvc.confirm(pay.id!).subscribe({
          next: confirmed => {
            this.payment = confirmed;
            this.saving  = false;
            this.done    = true;
            this.cdr.detectChanges();
          },
          error: () => {
            this.saving = false;
            this.error  = 'Pago creado pero no se pudo confirmar. Contacta recepción.';
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.saving = false;
        this.error  = 'No se pudo registrar el pago. Intenta de nuevo.';
        this.cdr.detectChanges();
      }
    });
  }

  calcNights(ci: string, co: string): number {
    const diff = Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  }

  formatDate(d: string): string {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${day} ${months[+m - 1]} ${y}`;
  }
}
