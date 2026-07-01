# Complete Project Documentation — Angular NgRx MFE Example

## Table of Contents

1. [Project Overview](#project-overview)
2. [Code Comments Summary](#code-comments-summary)
3. [Documentation Files Updated](#documentation-files-updated)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [YAML File Explained](#yaml-file-explained)
6. [Deployment Flow Diagram](#deployment-flow-diagram)

---

## Project Overview

This is an Angular 17 + NgRx Signal Store application with a Micro-Frontend (MFE) architecture. Built with standalone components, Angular Material, and Chart.js.

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | ^17.3.0 | Framework |
| @ngrx/signals | ^17.1.0 | Signal-based state management |
| Angular Material | ^17.3.0 | UI components |
| Chart.js | ^4.4.0 | Charts and data visualization |
| TypeScript | ~5.3.0 | Language |

### Repository

- **GitHub:** https://github.com/sj-84/redux_store_2025
- **Live Site:** https://sj-84.github.io/redux_store_2025/

---

## Code Comments Summary

Every major file in the project was annotated with explanatory comments. Below is the full content of each commented file.

### Host Application (`src/`)

#### `src/main.ts` — Application Entry Point

```typescript
// Bootstrap the Angular application using standalone component architecture.
// This is the entry point for the host (shell) application.
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// bootstrapApplication replaces the traditional NgModule bootstrap process.
// It accepts a root standalone component and an application config object
// that provides routing, animations, and other platform-level services.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

#### `src/app/app.component.ts` — Root Shell Component

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Application title displayed in the navbar; uses signal for reactivity
  title = signal('NgRx MFE Store');

  // Controls sidebar open/close state; toggled via navbar hamburger button
  sidenavOpen = signal(true);
}
```

#### `src/app/app.config.ts` — Application Configuration

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

// Application configuration object that replaces the traditional NgModule providers.
// This is passed to bootstrapApplication() in main.ts to configure the app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Register the application routes defined in app.routes.ts
    provideRouter(routes),
    // Enable Angular Material animations asynchronously (lazy-loaded)
    provideAnimationsAsync(),
  ]
};
```

#### `src/app/app.routes.ts` — Route Configuration

```typescript
import { Routes } from '@angular/router';

// Application-level route configuration for the host shell.
// Uses lazy loading for dashboard and product features to optimize bundle size.
export const routes: Routes = [
  // Default route redirects to dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard route: lazy-loads child routes from dashboard.routes.ts
  // loadChildren dynamically imports the dashboard feature module
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },

  // Products route: lazy-loads the ProductComponent standalone component
  // loadComponent is used for standalone components (Angular 17+)
  {
    path: 'products',
    loadComponent: () =>
      import('./product/product.component').then((m) => m.ProductComponent),
  },

  // Wildcard route: redirects any unknown paths to dashboard
  { path: '**', redirectTo: 'dashboard' },
];
```

#### `src/app/app.state.ts` — Legacy State Interface

```typescript
import { Product } from './product/product.model';

// Legacy AppState interface.
// Originally used with @ngrx/store's StoreModule.forRoot().
// Now replaced by the NgRx Signal Store (see store/product.store.ts).
// Kept for backward compatibility with any remaining store references.
export interface AppState {
  readonly product: Product[];
}
```

#### `src/app/store/product.store.ts` — NgRx Signal Store (Core State Management)

```typescript
// NgRx Signal Store for product state management.
// This is the modern Angular 17+ approach replacing traditional NgRx Actions/Reducers.
// Uses @ngrx/signals which provides a signal-based reactive store.
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Product } from '../product/product.model';
import { computed } from '@angular/core';

// State interface defining the shape of the product store
export interface ProductState {
  products: Product[];      // Array of all products in the store
  loading: boolean;         // Loading indicator for async operations
  error: string | null;     // Error message if an operation fails
}

// Initial state when the application starts
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Signal Store definition using the composable pattern:
// - signalStore: creates the store with optional providedIn for root-level singleton
// - withState: defines the initial state shape
// - withComputed: adds derived/computed values that react to state changes
// - withMethods: defines methods that can mutate the state via patchState
export const ProductStore = signalStore(
  { providedIn: 'root' },  // Makes the store a root-level singleton (injectable everywhere)
  withState<ProductState>(initialState),  // Register the initial state

  // Computed properties: automatically recalculate when underlying signals change
  withComputed((store) => ({
    // Total number of products in the store
    productCount: computed(() => store.products().length),

    // Sum of all product prices (revenue calculation)
    totalRevenue: computed(() =>
      store.products().reduce((sum, p) => sum + p.price, 0)
    ),

    // Boolean flag: true if there are any products
    hasProducts: computed(() => store.products().length > 0),
  })),

  // Methods: mutate state using patchState (immutable updates)
  withMethods((store) => ({
    // Add a new product to the store
    addProduct(product: Product) {
      patchState(store, (state) => ({
        products: [...state.products, product],  // Spread existing + new product
      }));
    },

    // Remove a product by its array index
    removeProduct(index: number) {
      patchState(store, (state) => ({
        products: state.products.filter((_, i) => i !== index),  // Filter out by index
      }));
    },

    // Clear all products from the store
    clearProducts() {
      patchState(store, { products: [], error: null });
    },

    // Toggle loading state (used for async operations)
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },

    // Set an error message and stop loading
    setError(error: string) {
      patchState(store, { error, loading: false });
    },
  }))
);
```

#### `src/app/product/product.model.ts` — Product Interface

```typescript
// Product entity interface.
// Defines the data shape for products managed in the application.
export interface Product {
  name: string;   // Display name of the product
  price: number;  // Price in the application's base currency
}
```

#### `src/app/product/product.component.ts` — Product CRUD Component

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './product.model';
import { ProductStore } from '../store/product.store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  // Inject the NgRx Signal Store using Angular's inject() function
  private productStore = inject(ProductStore);

  // Inject Angular Material's snack bar for toast notifications
  private snackBar = inject(MatSnackBar);

  // Local form state signals for two-way binding
  productName = signal('');       // Bound to product name input field
  productPrice = signal(0);       // Bound to product price input field

  // Expose store signals directly to the template for read-only access
  products = this.productStore.products;       // Product list from store
  productCount = this.productStore.productCount;  // Computed: total count
  totalRevenue = this.productStore.totalRevenue;  // Computed: sum of prices
  hasProducts = this.productStore.hasProducts;    // Computed: boolean check

  // Computed signal: form is valid only when name is non-empty and price > 0
  isFormValid = computed(() =>
    this.productName().length > 0 && this.productPrice() > 0
  );

  // Material table column definitions
  displayedColumns = ['index', 'name', 'price', 'actions'];

  // Add a new product to the store and reset the form
  addProduct() {
    if (!this.isFormValid()) return;  // Guard: only proceed if form is valid

    const product: Product = {
      name: this.productName(),
      price: this.productPrice(),
    };

    // Dispatch the add operation to the signal store
    this.productStore.addProduct(product);

    // Reset form fields to initial state
    this.productName.set('');
    this.productPrice.set(0);

    // Show success toast notification
    this.snackBar.open(`Product "${product.name}" added!`, 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  // Remove a product by its index in the store
  removeProduct(index: number) {
    this.productStore.removeProduct(index);
    this.snackBar.open('Product removed', 'Close', {
      duration: 1500,
    });
  }

  // Clear all products from the store
  clearAll() {
    this.productStore.clearProducts();
    this.snackBar.open('All products cleared', 'Close', {
      duration: 1500,
    });
  }
}
```

#### `src/app/layout/navbar/navbar.component.ts` — Top Toolbar

```typescript
import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <!-- Fixed top toolbar with brand name, sidebar toggle, and user menu -->
    <mat-toolbar color="primary" class="navbar">
      <!-- Hamburger button: emits toggleSidebar event to parent (AppComponent) -->
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="brand">NgRx MFE Store</span>
      <span class="spacer"></span>

      <!-- User avatar menu trigger -->
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <!-- Dropdown menu with user actions (profile, settings, logout) -->
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <button mat-menu-item>
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;   /* Fixed position so it stays at top during scroll */
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;     /* Above sidenav (z-index 1001 for sidenav) */
    }
    .brand {
      margin-left: 8px;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;   /* Pushes the user menu to the right */
    }
  `]
})
export class NavbarComponent {
  // EventEmitter that notifies the parent component (AppComponent) to toggle the sidenav
  @Output() toggleSidebar = new EventEmitter<void>();
}
```

#### `src/app/layout/sidebar/sidebar.component.ts` — Side Navigation

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <!-- Sidebar header with logo icon and brand text -->
    <div class="sidebar-header">
      <mat-icon class="logo-icon">storefront</mat-icon>
      <span class="logo-text">NgRx MFE</span>
    </div>

    <!-- Navigation list using Angular Material's mat-nav-list -->
    <mat-nav-list>
      <!-- Dashboard link: uses routerLinkActive to highlight when active -->
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>

      <!-- Products link -->
      <a mat-list-item routerLink="/products" routerLinkActive="active-link">
        <mat-icon matListItemIcon>inventory_2</mat-icon>
        <span matListItemTitle>Products</span>
      </a>

      <!-- Visual divider between navigation sections -->
      <mat-divider></mat-divider>

      <!-- Analytics link (placeholder - not yet routed) -->
      <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
        <mat-icon matListItemIcon>analytics</mat-icon>
        <span matListItemTitle>Analytics</span>
      </a>

      <!-- Settings link (placeholder - not yet routed) -->
      <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Settings</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.12);
    }
    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #673ab7;  /* Purple accent matching the app theme */
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }
    .active-link {
      background: rgba(103, 58, 183, 0.08) !important;  /* Purple tint for active state */
      color: #673ab7 !important;
    }
    .active-link mat-icon {
      color: #673ab7 !important;
    }
  `]
})
export class SidebarComponent {}
```

#### `src/app/layout/footer/footer.component.ts` — App Footer

```typescript
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDividerModule, MatIconModule],
  template: `
    <!-- Visual divider at the top of the footer -->
    <mat-divider></mat-divider>

    <!-- Footer content with copyright and tech stack info -->
    <footer class="footer">
      <span>NgRx MFE Store &copy; 2026</span>
      <span class="spacer"></span>
      <mat-icon class="footer-icon">favorite</mat-icon>
      <span>Built with Angular 17 + NgRx Signal Store</span>
    </footer>
  `,
  styles: [`
    .footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 24px;
      color: rgba(0,0,0,0.54);  /* Muted text color */
      font-size: 13px;
    }
    .spacer {
      flex: 1 1 auto;  /* Pushes content to edges */
    }
    .footer-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #e91e63;  /* Pink heart icon */
    }
  `]
})
export class FooterComponent {}
```

### Dashboard Components (`src/app/dashboard/`)

#### `src/app/dashboard/dashboard.routes.ts` — Child Routes

```typescript
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Child routes for the dashboard feature module.
// Loaded lazily via loadChildren in the parent app.routes.ts.
export const dashboardRoutes: Routes = [
  // Default dashboard route renders the main DashboardComponent
  { path: '', component: DashboardComponent },
];
```

#### `src/app/dashboard/core/models/analytics.model.ts` — Data Interfaces

```typescript
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
```

#### `src/app/dashboard/core/services/dashboard-data.service.ts` — Mock Data Service

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { DashboardStats, ActivityItem, GridRow } from '../models/analytics.model';

// Dashboard data service providing mock data for all dashboard feature components.
// Uses Angular signals for reactive data management.
// providedIn: 'root' makes this a singleton service available app-wide.
@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  // Core dashboard KPI stats as a writable signal
  readonly stats = signal<DashboardStats>({
    totalProducts: 128,
    totalRevenue: 48750.99,
    totalOrders: 342,
    growthRate: 12.5,
  });

  // Computed signal: transforms raw stats into an array of card config objects
  // Used by StatsCardsComponent to render KPI cards with icons, colors, and change indicators
  readonly statsCards = computed(() => [
    {
      label: 'Total Products',
      value: this.stats().totalProducts,
      icon: 'inventory_2',
      color: '#2196f3',   // Blue
      change: 8.2,
    },
    {
      label: 'Revenue',
      value: this.stats().totalRevenue,
      icon: 'attach_money',
      color: '#4caf50',   // Green
      change: 12.5,
      isCurrency: true,    // Flag: format as currency
    },
    {
      label: 'Orders',
      value: this.stats().totalOrders,
      icon: 'shopping_cart',
      color: '#ff9800',   // Orange
      change: -2.1,        // Negative: decline
    },
    {
      label: 'Growth Rate',
      value: this.stats().growthRate,
      icon: 'trending_up',
      color: '#9c27b0',   // Purple
      change: 5.3,
      isPercent: true,     // Flag: format as percentage
    },
  ]);

  // Monthly revenue data for the line chart (Jan-Dec 2026)
  readonly monthlyRevenue = signal({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [3200, 4100, 3800, 5200, 4800, 6100, 5400, 7200, 6800, 8100, 7500, 9200],
  });

  // Product category distribution for the doughnut chart
  readonly categoryDistribution = signal({
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'],
    datasets: [35, 25, 20, 12, 8],
  });

  // Order status breakdown for the bar chart
  readonly orderStatus = signal({
    labels: ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'],
    datasets: [45, 20, 15, 12, 8],
  });

  // Recent activity feed items with relative timestamps
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

  // Grid table data for daily sales performance metrics
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

  // Utility: converts a Date to a human-readable relative time string (e.g., "5m ago")
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
```

#### `src/app/dashboard/features/dashboard/dashboard.component.ts` — Dashboard Shell

```typescript
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
```

#### `src/app/dashboard/features/stats-cards/stats-cards.component.ts` — KPI Cards

```typescript
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

// Stats cards component displays KPI metrics in a responsive grid.
// Uses Angular 17's @for control flow to iterate over computed stats cards.
@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [DecimalPipe, MatCardModule, MatIconModule],
  template: `
    <div class="stats-grid">
      <!-- @for replaces *ngFor in Angular 17+ control flow syntax -->
      @for (card of dashboard.statsCards(); track card.label) {
        <mat-card class="stat-card">
          <mat-card-content>
            <!-- Icon container with dynamic background and icon colors -->
            <div class="stat-icon" [style.background]="card.color + '15'" [style.color]="card.color">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>

            <!-- Stat value and label -->
            <div class="stat-info">
              <span class="stat-value">
                <!-- @if/@else replaces *ngIf: format value based on type flags -->
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

            <!-- Change indicator with color-coded positive/negative styling -->
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
    /* Responsive grid: auto-fit cards with minimum 220px width */
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
  // Inject the dashboard data service to access statsCards computed signal
  dashboard = inject(DashboardDataService);
}
```

#### `src/app/dashboard/features/charts/charts.component.ts` — Chart.js Charts

```typescript
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
```

#### `src/app/dashboard/features/data-grid/data-grid.component.ts` — Material Data Table

```typescript
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

// Data grid component displaying recent sales data in a Material table.
// Uses Angular Material's MatTable with signal-based data source.
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
        <!-- Material table: [dataSource] bound to signal data (called with ()) -->
        <table mat-table [dataSource]="dashboard.gridData()" class="data-table">
          <!-- Date column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let row">{{ row.date }}</td>
          </ng-container>

          <!-- Metric name column -->
          <ng-container matColumnDef="metric">
            <th mat-header-cell *matHeaderCellDef>Metric</th>
            <td mat-cell *matCellDef="let row">{{ row.metric }}</td>
          </ng-container>

          <!-- Value column with number pipe formatting -->
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Value</th>
            <td mat-cell *matCellDef="let row">
              <strong>{{ row.value | number:'1.0-0' }}</strong>
            </td>
          </ng-container>

          <!-- Change column with color-coded badge and trend icon -->
          <ng-container matColumnDef="change">
            <th mat-header-cell *matHeaderCellDef>Change</th>
            <td mat-cell *matCellDef="let row">
              <span class="change-badge" [class]="row.status">
                <mat-icon>{{ row.status === 'positive' ? 'trending_up' : row.status === 'negative' ? 'trending_down' : 'remove' }}</mat-icon>
                {{ row.change > 0 ? '+' : '' }}{{ row.change }}%
              </span>
            </td>
          </ng-container>

          <!-- Status chip with color coding -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip [class]="'status-' + row.status">
                {{ row.status }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Table header and row definitions using structural directives -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .grid-card { margin-top: 8px; }
    .data-table { width: 100%; }
    .change-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .change-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .change-badge.positive { color: #4caf50; background: rgba(76, 175, 80, 0.08); }
    .change-badge.negative { color: #f44336; background: rgba(244, 67, 54, 0.08); }
    .change-badge.neutral { color: rgba(0, 0, 0, 0.54); background: rgba(0, 0, 0, 0.04); }
    .status-positive { background: rgba(76, 175, 80, 0.1) !important; color: #4caf50 !important; }
    .status-negative { background: rgba(244, 67, 54, 0.1) !important; color: #f44336 !important; }
    .status-neutral { background: rgba(0, 0, 0, 0.06) !important; color: rgba(0, 0, 0, 0.54) !important; }
  `]
})
export class DataGridComponent {
  // Inject dashboard data service for grid data signal
  dashboard = inject(DashboardDataService);

  // Column definitions for the Material table
  displayedColumns = ['date', 'metric', 'value', 'change', 'status'];
}
```

#### `src/app/dashboard/features/activity-feed/activity-feed.component.ts` — Activity Timeline

```typescript
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
```

### MFE Remote (`projects/mfe-dashboard/`)

#### `projects/mfe-dashboard/src/main.ts` — MFE Entry Point

```typescript
// Bootstrap the Micro-Frontend (MFE) dashboard application.
// This is the entry point for the standalone MFE remote app.
// It can run independently or be loaded into the host app via Module Federation.
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Standalone bootstrap: same pattern as the host app but with its own routes and config.
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
```

#### `projects/mfe-dashboard/src/app/app.component.ts` — MFE Root Shell

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// MFE root shell component.
// Minimal wrapper that renders child routes via <router-outlet>.
// In Module Federation, this component serves as the remote entry point.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
```

#### `projects/mfe-dashboard/src/app/app.config.ts` — MFE Configuration

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

// MFE application configuration.
// Provides routing and animations for the standalone dashboard micro-frontend.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
  ]
};
```

#### `projects/mfe-dashboard/src/app/app.routes.ts` — MFE Routes

```typescript
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StatsCardsComponent } from './features/stats-cards/stats-cards.component';
import { ChartsComponent } from './features/charts/charts.component';
import { DataGridComponent } from './features/data-grid/data-grid.component';
import { ActivityFeedComponent } from './features/activity-feed/activity-feed.component';

// MFE route configuration.
// Defines child routes for the dashboard when running as a standalone micro-frontend.
// The DashboardComponent acts as the layout shell with child content areas.
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,  // Dashboard shell layout
    children: [
      { path: '', component: StatsCardsComponent },        // Default: stats cards
      { path: 'charts', component: ChartsComponent },     // Charts view
      { path: 'data', component: DataGridComponent },     // Data grid view
      { path: 'activity', component: ActivityFeedComponent },  // Activity feed view
    ],
  },
];
```

#### `projects/mfe-dashboard/src/app/core/services/dashboard-data.service.ts` — MFE Data Service

```typescript
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
```

---

## Documentation Files Updated

### Files Modified

| File | What Changed |
|---|---|
| `README.md` | Complete rewrite: architecture, project structure, tech stack, key concepts, commands |
| `PROJECT_DOCUMENTATION.md` | Updated for Angular 17 + Signal Store (was Angular 16 + NgRx) |
| `.github/skills/angular-ngrx-example/SKILL.md` | Updated key files, conventions, workflow (was referencing deleted Actions/Reducers) |
| `.github/copilot-instructions.md` | Updated patterns, file structure, examples for Signal Store |

---

## GitHub Pages Deployment

### Step 1: Updated `angular.json` — Base Href

**Why?** GitHub Pages serves your site from a subdirectory (`/redux_store_2025/`), not the root. Without telling Angular this, all asset paths (JS, CSS, images) would break.

```json
"configurations": {
  "production": {
    "baseHref": "/redux_store_2025/",   // Added this line
    "budgets": [...],
    "outputHashing": "all"
  }
}
```

**What it does:** When Angular builds, it sets this in `dist/angular-ngrx/index.html`:
```html
<base href="/redux_store_2025/">
```
This tells the browser: "All relative URLs start from `/redux_store_2025/`".

### Step 2: Created `.github/workflows/deploy.yml`

**Why?** Without this file, you'd have to manually build and upload files every time you change code. This file tells GitHub: "Whenever I push code, automatically build and deploy my site."

### Step 3: Verified the Build

Ran `ng build --configuration production` locally to confirm:
- The build compiles without errors
- The output goes to `dist/angular-ngrx/`
- The `index.html` contains `<base href="/redux_store_2025/">`

### Step 4: Updated Git Remote

Changed the remote to the correct repository:
```bash
git remote set-url origin https://github.com/sj-84/redux_store_2025.git
```

### Step 5: Enabled GitHub Pages Source

In GitHub repo Settings > Pages, selected **GitHub Actions** as the source.

---

## YAML File Explained — Line by Line

### Complete File: `.github/workflows/deploy.yml`

```yaml
# Human-readable name for this workflow (shows in GitHub Actions UI)
name: Deploy to GitHub Pages
```

### Trigger — When Does This Run?

```yaml
on:
  push:
    branches: [main, master]    # Triggers when you push to main or master branch
  workflow_dispatch:             # Also allows manual trigger from GitHub Actions UI
```

**In plain English:** "Run this workflow every time code is pushed to `main`, or when someone clicks 'Run workflow' in the GitHub UI."

### Permissions — What Is GitHub Allowed to Do?

```yaml
permissions:
  contents: read      # Read the repository code
  pages: write        # Create/update GitHub Pages
  id-token: write     # Prove this deployment is authorized
```

**Why needed?** GitHub Pages deployment requires special permissions. Without these, the workflow would fail with a "permission denied" error.

### Concurrency — Prevent Overlapping Deployments

```yaml
concurrency:
  group: "pages"              # Group all deployments under one label
  cancel-in-progress: false   # Don't cancel a running deployment
```

**Why?** If you push twice quickly, you don't want two deployments fighting each other. This ensures only one deployment runs at a time, but doesn't cancel an in-progress one.

### Job 1: Build

```yaml
jobs:
  build:
    runs-on: ubuntu-latest     # Use Ubuntu Linux (GitHub's standard runner)
    steps:
```

#### Step 1: Download the code
```yaml
      - name: Checkout
        uses: actions/checkout@v4
```
Downloads your repository code to the build machine.

#### Step 2: Install Node.js
```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"    # Use Node.js version 20
          cache: "npm"          # Cache npm packages for faster builds
```

#### Step 3: Install dependencies
```yaml
      - name: Install dependencies
        run: npm ci
```
`npm ci` is like `npm install` but faster and stricter — it installs exactly what's in `package-lock.json`.

#### Step 4: Build the Angular app
```yaml
      - name: Build for GitHub Pages
        run: npm run build -- --configuration production
```
Runs `ng build --configuration production`, which:
- Compiles TypeScript to JavaScript
- Bundles everything into `dist/angular-ngrx/`
- Applies optimizations (minification, tree-shaking)
- Uses the `baseHref: "/redux_store_2025/"` from angular.json

#### Step 5: Upload the build output
```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist/angular-ngrx"
```
Takes the `dist/angular-ngrx/` folder and uploads it as a deployment artifact that the next job can use.

### Job 2: Deploy

```yaml
  deploy:
    environment:
      name: github-pages                          # Target GitHub Pages
      url: ${{ steps.deployment.outputs.page_url }}  # Output the final URL
    runs-on: ubuntu-latest
    needs: build    # Only run AFTER the build job succeeds
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
Takes the uploaded artifact and publishes it to GitHub Pages.

---

## Deployment Flow Diagram

```
You push code to main
        |
        v
GitHub sees .github/workflows/deploy.yml
        |
        v
Job 1 (build) starts:
  +-- Checkout code
  +-- Install Node.js 20
  +-- npm ci (install deps)
  +-- ng build --configuration production
  +-- Upload dist/angular-ngrx/
        |
        v
Job 2 (deploy) starts:
  +-- Publish to GitHub Pages
        |
        v
Site live at https://sj-84.github.io/redux_store_2025/
```

**Total time:** ~2 minutes per deployment.

---

## Quick Reference Commands

| Command | Description |
|---|---|
| `ng serve` | Start host dev server |
| `ng serve mfe-dashboard` | Start MFE dev server |
| `ng build --configuration production` | Production build |
| `ng test` | Run unit tests |
| `git push origin main` | Triggers auto-deployment |
