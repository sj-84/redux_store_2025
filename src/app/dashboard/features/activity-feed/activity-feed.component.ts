import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

// Activity feed component displaying recent system activities.
// Uses Angular 17's @for control flow to iterate over activity items.
@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule],
  template: `
    <mat-card class="activity-card">
      <mat-card-header>
        <mat-card-title>Recent Activity</mat-card-title>
        <mat-card-subtitle>Last 24 hours</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <!-- @for iterates over activity items; track by unique id for performance -->
          @for (item of dashboard.recentActivity(); track item.id) {
            <mat-list-item class="activity-item">
              <!-- Color-coded icon with dynamic background -->
              <div class="activity-icon" matListItemIcon [style.background]="item.color + '15'" [style.color]="item.color">
                <mat-icon>{{ item.icon }}</mat-icon>
              </div>

              <!-- Activity description: action + target -->
              <div matListItemTitle class="activity-title">
                <strong>{{ item.action }}</strong> {{ item.target }}
              </div>

              <!-- Relative timestamp (e.g., "5m ago", "2h ago") -->
              <div matListItemLine class="activity-time">
                {{ dashboard.timeAgo(item.timestamp) }}
              </div>
            </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .activity-card { height: 100%; }  /* Fill available height in grid layout */
    .activity-item { margin-bottom: 4px; }
    .activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      margin-right: 8px;
    }
    .activity-icon mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .activity-title { font-size: 13px !important; color: rgba(0, 0, 0, 0.7); }
    .activity-title strong { color: rgba(0, 0, 0, 0.87); }
    .activity-time { font-size: 12px !important; color: rgba(0, 0, 0, 0.38) !important; }
  `]
})
export class ActivityFeedComponent {
  // Inject dashboard data service for recentActivity signal and timeAgo utility
  dashboard = inject(DashboardDataService);
}
