import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error = '';

  form = new FormGroup({
    userName: new FormControl('', Validators.required),
    token: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (this.form.invalid) return;
    const { userName, token } = this.form.value;
    if (!token?.trim()) {
      this.error = 'Ingresa un token JWT válido.';
      return;
    }
    this.auth.saveToken(token.trim());
    this.auth.saveUserName(userName || 'Administrador');
    this.router.navigate(['/dashboard']);
  }
}
