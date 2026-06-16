import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users',     loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'rooms',     loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent) },
      { path: 'bookings',  loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsComponent) },
      { path: 'payments',  loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
