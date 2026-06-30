import { Routes } from '@angular/router';

// Application-level route configuration for the host shell.
// Uses lazy loading for dashboard and product features to optimize bundle size.
export const routes: Routes = [
  // Default route redirects to dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard route: lazy-loads child routes from dashboard.routes.ts
  // loadChildren dynamically imports the dashboard feature module
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },

  // Products route: lazy-loads the ProductComponent standalone component
  // loadComponent is used for standalone components (Angular 17+)
  {
    path: 'products',
    loadComponent: () =>
      import('./product/product.component').then((m) => m.ProductComponent),
  },

  // Wildcard route: redirects any unknown paths to dashboard
  { path: '**', redirectTo: 'dashboard' },
];
