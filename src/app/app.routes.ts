import { Routes } from '@angular/router';


import { MainLayoutComponent } from './shared/components/layouts/main-layout.component';

export const routes: Routes = [
  {path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', 
        loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent)},
      { path: 'dashboard/user', 
        loadChildren: () => import('./features/dashboard/user/components/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'dashboard/admin', 
        loadChildren: () => import('./features/dashboard/admin/components/admin-dashboard.component').then(m => m.AdminDashboardComponent)},
  
    ]},
    { path: 'auth',
      children: [
        {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login-page.component').then(m => m.LoginPageComponent)
        }
      ]
    }
  ,
  { path: '**', redirectTo: '' }
  ]

