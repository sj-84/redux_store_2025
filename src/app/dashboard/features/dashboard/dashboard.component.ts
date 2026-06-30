import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ChartsComponent } from '../charts/charts.component';
import { DataGridComponent } from '../data-grid/data-grid.component';
import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';

// Dashboard shell component that composes all dashboard feature components.
// Acts as a layout container arranging stats cards, charts, activity feed, and data grid.
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    StatsCardsComponent,
    ChartsComponent,
    DataGridComponent,
    ActivityFeedComponent,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Dashboard page header -->
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <span class="subtitle">Analytics & Overview</span>
      </div>

      <!-- KPI stats cards row (total products, revenue, orders, growth) -->
      <app-stats-cards />

      <!-- Two-column grid: charts (left 2/3) + activity feed (right 1/3) -->
      <div class="dashboard-grid">
        <div class="chart-section">
          <app-charts />
        </div>
        <div class="activity-section">
          <app-activity-feed />
        </div>
      </div>

      <!-- Data grid table at the bottom -->
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

    /* Two-column responsive grid: 2:1 ratio for charts vs activity */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    /* Stack columns on smaller screens */
    @media (max-width: 960px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {}
