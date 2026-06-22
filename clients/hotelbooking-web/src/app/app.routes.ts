import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ── Rutas públicas (sin auth) ──────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { path: '',           loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'rooms',      loadComponent: () => import('./pages/public-rooms/public-rooms.component').then(m => m.PublicRoomsComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/public-promotions/public-promotions.component').then(m => m.PublicPromotionsComponent) },
      { path: 'booking/:roomId',    loadComponent: () => import('./pages/public-booking/public-booking.component').then(m => m.PublicBookingComponent) },
      { path: 'payment/:bookingId', loadComponent: () => import('./pages/public-payment/public-payment.component').then(m => m.PublicPaymentComponent) },
    ]
  },

  // ── Login ──────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // ── Rutas admin protegidas ─────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '',              redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',     loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users',         loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'rooms',         loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent) },
      { path: 'promotions',    loadComponent: () => import('./pages/admin-promotions/admin-promotions.component').then(m => m.AdminPromotionsComponent) },
      { path: 'bookings',      loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsComponent) },
      { path: 'payments',      loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) }
    ]
  },

  // ── Fallback ───────────────────────────────────────────────────────────
  { path: '**', redirectTo: '' }
];
