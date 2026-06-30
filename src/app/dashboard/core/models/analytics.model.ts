// Dashboard analytics data models.
// These interfaces define the shape of data used across dashboard feature components.

// KPI stats displayed in the stats cards section
export interface DashboardStats {
  totalProducts: number;   // Total product count in the system
  totalRevenue: number;    // Total revenue earned
  totalOrders: number;     // Total orders placed
  growthRate: number;      // Percentage growth rate
}

// Chart data structure for Chart.js integration
export interface ChartData {
  labels: string[];   // X-axis labels (e.g., months, categories)
  datasets: number[];  // Data values corresponding to each label
}

// Single activity item in the activity feed
export interface ActivityItem {
  id: number;         // Unique identifier for the activity
  action: string;     // Action type (e.g., "Added", "Updated", "Deleted")
  target: string;     // Target entity name or description
  timestamp: Date;    // When the activity occurred
  icon: string;       // Material icon name for display
  color: string;      // Hex color for the icon background
}

// Row in the data grid table
export interface GridRow {
  id: number;                                          // Unique row identifier
  date: string;                                        // Date string (YYYY-MM-DD format)
  metric: string;                                      // Metric name (e.g., "Total Sales")
  value: number;                                       // Metric value
  change: number;                                      // Percentage change from previous period
  status: 'positive' | 'negative' | 'neutral';        // Visual indicator for change direction
}
