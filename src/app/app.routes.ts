import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { AdminDashboardComponent } from './features/dashboard/admin/components/admin-dashboard.component';
import { UserDashboardComponent } from './features/dashboard/user/components/user-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: 'dashboard/user', component: UserDashboardComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
