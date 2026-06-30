import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [DecimalPipe, MatCardModule, MatIconModule],
  template: `
    <div class="stats-grid">
      @for (card of dashboard.statsCards(); track card.label) {
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon" [style.background]="card.color + '15'" [style.color]="card.color">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">
                @if (card.isCurrency) {
                  {{ card.value | number:'1.0-0' }}
                } @else if (card.isPercent) {
                  {{ card.value }}%
                } @else {
                  {{ card.value | number }}
                }
              </span>
              <span class="stat-label">{{ card.label }}</span>
            </div>
            <div class="stat-change" [class.positive]="card.change > 0" [class.negative]="card.change < 0">
              <mat-icon>{{ card.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              <span>{{ card.change > 0 ? '+' : '' }}{{ card.change }}%</span>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 12px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 16px;
    }

    .stat-change mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .stat-change.positive {
      color: #4caf50;
      background: rgba(76, 175, 80, 0.08);
    }

    .stat-change.negative {
      color: #f44336;
      background: rgba(244, 67, 54, 0.08);
    }
  `]
})
export class StatsCardsComponent {
  dashboard = inject(DashboardDataService);
}
