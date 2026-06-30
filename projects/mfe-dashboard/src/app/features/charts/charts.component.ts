import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Revenue Overview</mat-card-title>
        <mat-card-subtitle>Monthly revenue for 2026</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <canvas #revenueChart></canvas>
      </mat-card-content>
    </mat-card>

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

    @media (max-width: 600px) {
      .chart-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ChartsComponent implements AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orderChart') orderChartRef!: ElementRef<HTMLCanvasElement>;

  private dashboard = inject(DashboardDataService);

  ngAfterViewInit() {
    this.createRevenueChart();
    this.createCategoryChart();
    this.createOrderChart();
  }

  private createRevenueChart() {
    const data = this.dashboard.monthlyRevenue();
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Revenue',
          data: data.datasets,
          borderColor: '#673ab7',
          backgroundColor: 'rgba(103, 58, 183, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  private createCategoryChart() {
    const data = this.dashboard.categoryDistribution();
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];
    new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
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
          legend: { position: 'bottom', labels: { padding: 16 } },
        },
      },
    });
  }

  private createOrderChart() {
    const data = this.dashboard.orderStatus();
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336'];
    new Chart(this.orderChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Orders',
          data: data.datasets,
          backgroundColor: colors,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}
