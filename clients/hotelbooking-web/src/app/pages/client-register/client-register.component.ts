import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientAuthService } from '../../core/services/client-auth.service';

function passwordsMatch(ctrl: AbstractControl): ValidationErrors | null {
  const pw  = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-register.component.html'
})
export class ClientRegisterComponent {
  form:    FormGroup;
  error   = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientAuth: ClientAuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      fullName:        ['', Validators.required],
      documentType:    ['DNI', Validators.required],
      documentNumber:  ['', Validators.required],
      password:        ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
      phone:           [''],
      email:           ['', Validators.email]
    }, { validators: passwordsMatch });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error   = '';

    const { confirmPassword, ...payload } = this.form.value as any;

    this.clientAuth.register(payload).subscribe({
      error: (err: any) => {
        this.error   = err?.error?.message ?? 'Error al registrarse. El documento puede estar en uso.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
