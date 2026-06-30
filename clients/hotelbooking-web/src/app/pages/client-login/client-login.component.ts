import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientAuthService } from '../../core/services/client-auth.service';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-login.component.html'
})
export class ClientLoginComponent {
  form:    FormGroup;
  error   = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientAuth: ClientAuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      documentNumber: ['', Validators.required],
      password:       ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    this.clientAuth.login(this.form.value as any).subscribe({
      error: () => {
        this.error   = 'Credenciales incorrectas. Verifica tu número de documento y contraseña.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
