import { Injectable, signal, computed } from '@angular/core';
import { DashboardStats, ActivityItem, GridRow } from '../models/analytics.model';

// MFE Dashboard data service.
// Provides mock data signals for the standalone micro-frontend dashboard.
// Mirrors the host app's DashboardDataService for consistent behavior.
@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  // Core KPI stats
  readonly stats = signal<DashboardStats>({
    totalProducts: 128,
    totalRevenue: 48750.99,
    totalOrders: 342,
    growthRate: 12.5,
  });

  // Computed: transform stats into card configuration array
  readonly statsCards = computed(() => [
    {
      label: 'Total Products',
      value: this.stats().totalProducts,
      icon: 'inventory_2',
      color: '#2196f3',
      change: 8.2,
    },
    {
      label: 'Revenue',
      value: this.stats().totalRevenue,
      icon: 'attach_money',
      color: '#4caf50',
      change: 12.5,
      isCurrency: true,
    },
    {
      label: 'Orders',
      value: this.stats().totalOrders,
      icon: 'shopping_cart',
      color: '#ff9800',
      change: -2.1,
    },
    {
      label: 'Growth Rate',
      value: this.stats().growthRate,
      icon: 'trending_up',
      color: '#9c27b0',
      change: 5.3,
      isPercent: true,
    },
  ]);

  // Monthly revenue data for line chart
  readonly monthlyRevenue = signal({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [3200, 4100, 3800, 5200, 4800, 6100, 5400, 7200, 6800, 8100, 7500, 9200],
  });

  // Category distribution for doughnut chart
  readonly categoryDistribution = signal({
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'],
    datasets: [35, 25, 20, 12, 8],
  });

  // Order status for bar chart
  readonly orderStatus = signal({
    labels: ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'],
    datasets: [45, 20, 15, 12, 8],
  });

  // Activity feed items with relative timestamps
  readonly recentActivity = signal<ActivityItem[]>([
    { id: 1, action: 'Added', target: 'Wireless Headphones', timestamp: new Date(Date.now() - 300000), icon: 'add_circle', color: '#4caf50' },
    { id: 2, action: 'Updated', target: 'Product pricing for Smart Watch', timestamp: new Date(Date.now() - 900000), icon: 'edit', color: '#2196f3' },
    { id: 3, action: 'Deleted', target: 'Outdated Camera Model', timestamp: new Date(Date.now() - 1800000), icon: 'delete', color: '#f44336' },
    { id: 4, action: 'Order placed', target: '#ORD-7892', timestamp: new Date(Date.now() - 3600000), icon: 'receipt', color: '#ff9800' },
    { id: 5, action: 'Stock updated', target: 'USB-C Cables (x50)', timestamp: new Date(Date.now() - 7200000), icon: 'update', color: '#9c27b0' },
    { id: 6, action: 'New category', target: 'Smart Home Devices', timestamp: new Date(Date.now() - 14400000), icon: 'new_label', color: '#00bcd4' },
    { id: 7, action: 'Bulk import', target: '250 products from CSV', timestamp: new Date(Date.now() - 28800000), icon: 'upload_file', color: '#607d8b' },
    { id: 8, action: 'Price alert', target: 'Laptop prices adjusted by -10%', timestamp: new Date(Date.now() - 43200000), icon: 'price_change', color: '#e91e63' },
  ]);

  // Grid table data
  readonly gridData = signal<GridRow[]>([
    { id: 1, date: '2026-06-29', metric: 'Total Sales', value: 12500, change: 8.2, status: 'positive' },
    { id: 2, date: '2026-06-28', metric: 'Total Sales', value: 11800, change: 3.1, status: 'positive' },
    { id: 3, date: '2026-06-27', metric: 'Total Sales', value: 11200, change: -2.4, status: 'negative' },
    { id: 4, date: '2026-06-26', metric: 'Total Sales', value: 11500, change: 1.8, status: 'positive' },
    { id: 5, date: '2026-06-25', metric: 'Total Sales', value: 11000, change: 0, status: 'neutral' },
    { id: 6, date: '2026-06-24', metric: 'Total Sales', value: 10800, change: -5.2, status: 'negative' },
    { id: 7, date: '2026-06-23', metric: 'Total Sales', value: 11400, change: 6.7, status: 'positive' },
    { id: 8, date: '2026-06-22', metric: 'Total Sales', value: 10700, change: 2.3, status: 'positive' },
  ]);

  // Utility: converts Date to relative time string
  timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
