import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StatsCardsComponent } from './features/stats-cards/stats-cards.component';
import { ChartsComponent } from './features/charts/charts.component';
import { DataGridComponent } from './features/data-grid/data-grid.component';
import { ActivityFeedComponent } from './features/activity-feed/activity-feed.component';

// MFE route configuration.
// Defines child routes for the dashboard when running as a standalone micro-frontend.
// The DashboardComponent acts as the layout shell with child content areas.
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,  // Dashboard shell layout
    children: [
      { path: '', component: StatsCardsComponent },        // Default: stats cards
      { path: 'charts', component: ChartsComponent },     // Charts view
      { path: 'data', component: DataGridComponent },     // Data grid view
      { path: 'activity', component: ActivityFeedComponent },  // Activity feed view
    ],
  },
];
