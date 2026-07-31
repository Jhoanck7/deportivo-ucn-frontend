import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'google-sim',
    loadComponent: () =>
      import('./pages/google-sim-page/google-sim-page.component').then((m) => m.GoogleSimPageComponent),
  },
  {
    path: 'google-callback',
    loadComponent: () =>
      import('./pages/google-callback-page/google-callback-page.component').then((m) => m.GoogleCallbackPageComponent),
  },
];
