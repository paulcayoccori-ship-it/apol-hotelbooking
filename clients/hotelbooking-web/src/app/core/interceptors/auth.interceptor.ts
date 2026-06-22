import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router      = inject(Router);
  const token       = localStorage.getItem('access_token');
  const isGateway   = req.url.startsWith(environment.apiUrl);

  const outReq = (token && isGateway)
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(outReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Solo actúa en 401 del Gateway, no de Keycloak
      if (err.status === 401 && isGateway) {
        localStorage.removeItem('access_token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
