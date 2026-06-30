import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Child routes for the dashboard feature module.
// Loaded lazily via loadChildren in the parent app.routes.ts.
export const dashboardRoutes: Routes = [
  // Default dashboard route renders the main DashboardComponent
  { path: '', component: DashboardComponent },
];
