import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

// Register all Chart.js components (scales, elements, plugins, etc.)
// This is required before creating any Chart instances.
Chart.register(...registerables);

// Charts component renders three Chart.js visualizations:
// 1. Line chart: Monthly revenue trend
// 2. Doughnut chart: Category distribution
// 3. Bar chart: Order status breakdown
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <!-- Main revenue line chart -->
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Revenue Overview</mat-card-title>
        <mat-card-subtitle>Monthly revenue for 2026</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <!-- Template reference variable: Canvas element for Chart.js rendering -->
        <canvas #revenueChart></canvas>
      </mat-card-content>
    </mat-card>

    <!-- Two smaller charts side by side -->
    <div class="chart-row">
      <mat-card class="chart-card small">
        <mat-card-header>
          <mat-card-title>Category Distribution</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas #categoryChart></canvas>
        </mat-card-content>
      </mat-card>

      <mat-card class="chart-card small">
        <mat-card-header>
          <mat-card-title>Order Status</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas #orderChart></canvas>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .chart-card canvas {
      max-height: 280px;
    }
    .chart-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .chart-card.small canvas {
      max-height: 220px;
    }
    /* Stack smaller charts vertically on mobile */
    @media (max-width: 600px) {
      .chart-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ChartsComponent implements AfterViewInit {
  // ViewChild references: access canvas DOM elements after view initialization
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orderChart') orderChartRef!: ElementRef<HTMLCanvasElement>;

  // Inject the dashboard data service for chart data signals
  private dashboard = inject(DashboardDataService);

  // Lifecycle hook: called after the component's view has been fully initialized.
  // Charts must be created here because ViewChild references are only available after view init.
  ngAfterViewInit() {
    this.createRevenueChart();
    this.createCategoryChart();
    this.createOrderChart();
  }

  // Creates a line chart showing monthly revenue trend
  private createRevenueChart() {
    const data = this.dashboard.monthlyRevenue();
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',  // Line chart type
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Revenue',
          data: data.datasets,
          borderColor: '#673ab7',           // Purple line color
          backgroundColor: 'rgba(103, 58, 183, 0.1)',  // Light purple fill
          fill: true,                        // Fill area under the line
          tension: 0.4,                      // Smooth curves (0 = sharp, 1 = very smooth)
          pointRadius: 4,                    // Data point size
          pointHoverRadius: 6,               // Data point size on hover
        }],
      },
      options: {
        responsive: true,                    // Responsive to container size
        maintainAspectRatio: false,          // Allow custom height via CSS
        plugins: { legend: { display: false } },  // Hide legend (single dataset)
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },   // Hide vertical grid lines
        },
      },
    });
  }

  // Creates a doughnut chart showing product category distribution
  private createCategoryChart() {
    const data = this.dashboard.categoryDistribution();
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];  // Distinct colors per category
    new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',  // Doughnut chart type (pie with hole)
      data: {
        labels: data.labels,
        datasets: [{
          data: data.datasets,
          backgroundColor: colors,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16 } },  // Legend below chart
        },
      },
    });
  }

  // Creates a bar chart showing order status breakdown
  private createOrderChart() {
    const data = this.dashboard.orderStatus();
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336'];  // Color-coded by status
    new Chart(this.orderChartRef.nativeElement, {
      type: 'bar',  // Bar chart type
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Orders',
          data: data.datasets,
          backgroundColor: colors,
          borderRadius: 6,  // Rounded bar corners
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },  // Hide legend (single dataset)
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}
