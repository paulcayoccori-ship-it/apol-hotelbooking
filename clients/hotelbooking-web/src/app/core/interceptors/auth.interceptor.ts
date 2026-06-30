import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Devuelve true si la petición va a una ruta pública que NO debe llevar
 * el token de admin (para evitar que el Gateway rechace con 401 cuando
 * el token de Keycloak está expirado o es inválido).
 *
 * Se verifica también el método HTTP para no bloquear operaciones del
 * panel admin que sí requieren autenticación (ej: GET /api/v1/bookings).
 */
function isPublicRequest(req: HttpRequest<unknown>): boolean {
  const path = req.url.replace(environment.apiUrl, '');

  // GET /api/v1/rooms/** — siempre público (web pública y panel admin solo leen)
  if (req.method === 'GET' && path.startsWith('/api/v1/rooms')) return true;

  // Login / registro de clientes (web pública)
  if (path.startsWith('/api/v1/users/client/')) return true;

  // POST /api/v1/bookings — crear reserva (web pública)
  if (req.method === 'POST' && path === '/api/v1/bookings') return true;

  // GET /api/v1/bookings/{id} — ver reserva antes de pago (web pública)
  if (req.method === 'GET' && /^\/api\/v1\/bookings\/\d+$/.test(path)) return true;

  // POST /api/v1/payments — crear pago (web pública)
  if (req.method === 'POST' && path === '/api/v1/payments') return true;

  // PATCH /api/v1/payments/{id}/confirm — confirmar pago (web pública)
  if (req.method === 'PATCH' && path.endsWith('/confirm')) return true;

  return false;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router    = inject(Router);
  const token     = localStorage.getItem('access_token');
  const isGateway = req.url.startsWith(environment.apiUrl);

  // Solo adjuntar el token de admin Keycloak en rutas protegidas.
  // Las rutas públicas NO deben llevar el token: si el token está
  // expirado, el Gateway lo rechazaría con 401 aunque la ruta sea permitAll().
  const shouldAttachToken = token && isGateway && !isPublicRequest(req);

  const outReq = shouldAttachToken
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(outReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Solo redirigir a /login si la sesión admin expiró dentro del panel /admin
      const isAdminRoute = router.url.startsWith('/admin');
      if (err.status === 401 && isGateway && isAdminRoute) {
        localStorage.removeItem('access_token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
