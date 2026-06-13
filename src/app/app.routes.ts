import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './features/dashboard/admin/dashboard-layout/admin-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'rent',
        loadChildren: () =>
          import('./features/bookings/bookings.routes').then((m) => m.BOOKINGS_ROUTES),
      },
      {
        path: 'design-system',
        loadComponent: () =>
          import('./features/design-system/design-system-page.component').then(
            (m) => m.DesignSystemPageComponent,
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard-admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
