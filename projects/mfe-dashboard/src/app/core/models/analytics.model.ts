export interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  growthRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: number[];
}

export interface ActivityItem {
  id: number;
  action: string;
  target: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface GridRow {
  id: number;
  date: string;
  metric: string;
  value: number;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
}
