import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { apiErrMsg } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  success = '';
  showModal = false;
  editId: number | null = null;

  readonly roles = ['ADMIN', 'RECEPTIONIST', 'CLIENT'];

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    role: new FormControl('CLIENT', Validators.required),
    enabled: new FormControl(true)
  });

  constructor(private svc: UserService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.users = d; this.loading = false; },
      error: e => { this.error = this.errMsg(e); this.loading = false; }
    });
  }

  openCreate(): void {
    this.editId = null;
    this.form.reset({ role: 'CLIENT', enabled: true });
    this.showModal = true;
  }

  openEdit(u: User): void {
    this.editId = u.id!;
    this.form.patchValue(u);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const body = this.form.value as User;
    const obs$ = this.editId ? this.svc.update(this.editId, body) : this.svc.create(body);
    obs$.subscribe({
      next: () => { this.success = this.editId ? 'Usuario actualizado.' : 'Usuario creado.'; this.closeModal(); this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success = 'Usuario eliminado.'; this.load(); this.autoClear(); },
      error: e => { this.error = this.errMsg(e); }
    });
  }

  closeModal(): void { this.showModal = false; }

  errMsg(e: any): string { return apiErrMsg(e); }

  autoClear(): void { setTimeout(() => { this.success = ''; this.error = ''; }, 3500); }

  get editMode(): boolean { return this.editId !== null; }
}
