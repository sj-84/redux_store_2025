import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [DecimalPipe, MatTableModule, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <mat-card class="grid-card">
      <mat-card-header>
        <mat-card-title>Recent Sales Data</mat-card-title>
        <mat-card-subtitle>Daily sales performance metrics</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="dashboard.gridData()" class="data-table">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let row">{{ row.date }}</td>
          </ng-container>

          <ng-container matColumnDef="metric">
            <th mat-header-cell *matHeaderCellDef>Metric</th>
            <td mat-cell *matCellDef="let row">{{ row.metric }}</td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let row">
              <strong>{{ row.value | number:'1.0-0' }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="change">
            <th mat-header-cell *matHeaderCellDef>Change</th>
            <td mat-cell *matCellDef="let row">
              <span class="change-badge" [class]="row.status">
                <mat-icon>{{ row.status === 'positive' ? 'trending_up' : row.status === 'negative' ? 'trending_down' : 'remove' }}</mat-icon>
                {{ row.change > 0 ? '+' : '' }}{{ row.change }}%
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip [class]="'status-' + row.status">
                {{ row.status }}
              </mat-chip>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .grid-card {
      margin-top: 8px;
    }

    .data-table {
      width: 100%;
    }

    .change-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .change-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .change-badge.positive {
      color: #4caf50;
      background: rgba(76, 175, 80, 0.08);
    }

    .change-badge.negative {
      color: #f44336;
      background: rgba(244, 67, 54, 0.08);
    }

    .change-badge.neutral {
      color: rgba(0, 0, 0, 0.54);
      background: rgba(0, 0, 0, 0.04);
    }

    .status-positive { background: rgba(76, 175, 80, 0.1) !important; color: #4caf50 !important; }
    .status-negative { background: rgba(244, 67, 54, 0.1) !important; color: #f44336 !important; }
    .status-neutral { background: rgba(0, 0, 0, 0.06) !important; color: rgba(0, 0, 0, 0.54) !important; }
  `]
})
export class DataGridComponent {
  dashboard = inject(DashboardDataService);
  displayedColumns = ['date', 'metric', 'value', 'change', 'status'];
}
