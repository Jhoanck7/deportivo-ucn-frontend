import { Routes } from '@angular/router';

export const BOOKINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/rent-page/rent-page.component').then((m) => m.RentPageComponent),
  },
];
