import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ChartsComponent } from '../charts/charts.component';
import { DataGridComponent } from '../data-grid/data-grid.component';
import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';

// MFE Dashboard shell component.
// Identical layout to the host app's dashboard but designed for standalone operation.
// When loaded via Module Federation, this component renders within the host's router.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    StatsCardsComponent,
    ChartsComponent,
    DataGridComponent,
    ActivityFeedComponent,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Page header -->
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <span class="subtitle">Analytics & Overview</span>
      </div>

      <!-- KPI stats cards -->
      <app-stats-cards />

      <!-- Two-column grid: charts + activity feed -->
      <div class="dashboard-grid">
        <div class="chart-section">
          <app-charts />
        </div>
        <div class="activity-section">
          <app-activity-feed />
        </div>
      </div>

      <!-- Data grid table -->
      <app-data-grid />
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .dashboard-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 500;
      color: #333;
    }

    .subtitle {
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    @media (max-width: 960px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {}
