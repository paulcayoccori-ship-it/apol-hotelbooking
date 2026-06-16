import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  if (localStorage.getItem('hb_token')) return true;
  inject(Router).navigate(['/login']);
  return false;
};
