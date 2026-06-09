import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'explorer' },
  {
    path: 'explorer',
    loadComponent: () =>
      import('./features/explorer/breed-explorer').then((m) => m.BreedExplorer),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./features/table/breed-table').then((m) => m.BreedTable),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile').then((m) => m.Profile),
  },
  { path: '**', redirectTo: 'explorer' },
];
