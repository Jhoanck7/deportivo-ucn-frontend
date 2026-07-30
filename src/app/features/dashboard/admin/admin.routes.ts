import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () =>
      import('./pages/overview-page/overview-page.component').then(
        (m) => m.OverviewPageComponent,
      ),
  },
  {
    path: 'roster',
    loadComponent: () =>
      import('./pages/roster-page/roster-page.component').then((m) => m.RosterPageComponent),
  },
  {
    path: 'sport-branches',
    loadComponent: () =>
      import('./pages/sport-branch-page/sport-branch-page.component').then(
        (m) => m.SportBranchPageComponent,
      ),
  },
  {
    path: 'news-events',
    loadComponent: () =>
      import('./pages/news-events-page/news-events-page.component').then(
        (m) => m.NewsEventsPageComponent,
      ),
  },
];
