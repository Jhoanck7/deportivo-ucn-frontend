import { Routes } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';
import { DashboardLayoutComponent  } from './shared/components/layouts/dashboard-layout/dashboard-layout.component';

import { MainLayoutComponent } from './shared/components/layouts/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', 
        loadComponent: () => import('./features/home/pages/home-page/home-page.component')
        .then(m => m.HomePageComponent)},
      {
        path: 'rent', 
        loadComponent: () => import('./features/rent/rent-page.component').then(m => m.RentPageComponent)
      },
      {
        path: 'design-system',
        loadComponent: () => import('./features/design-system/design-system-page.component').then(m => m.DesignSystemPageComponent)
      }
    ]
  },
  { path: 'auth',
    children: [
      { path: 'login',
        loadComponent: () => import('./features/auth/components/login/login-page.component')
        .then(m => m.LoginPageComponent)
      }]
  },
  {
    path: 'dashboard-admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canMatch: [() => inject(AuthService).currentUserRole() === 'admin'],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/admin/components/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)    
      },
      {
        path: 'roster',
        loadComponent: () => import('./features/dashboard/admin/pages/roster-page.component').then(m => m.RosterPageComponent)
      }
    ]
  }

  ,
  { path: '**', redirectTo: '' }
  ]


