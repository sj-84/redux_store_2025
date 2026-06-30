# Angular NgRx MFE Project Documentation

## Overview

This project is an Angular 17 application demonstrating modern state management with NgRx Signal Store and a Micro-Frontend (MFE) architecture. It features a host shell application with a product management module and a dashboard analytics section that can also run as a standalone micro-frontend.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | ^17.3.0 | Framework (standalone components) |
| @ngrx/signals | ^17.1.0 | Signal-based state management |
| @ngrx/store | ^17.1.0 | Legacy NgRx (listed but not actively used) |
| @ngrx/effects | ^17.1.0 | Legacy NgRx (listed but not actively used) |
| Angular Material | ^17.3.0 | UI component library |
| Chart.js | ^4.4.0 | Chart rendering |
| ng2-charts | ^5.0.0 | Angular Chart.js wrapper |
| TypeScript | ~5.3.0 | Language |
| RxJS | ~7.8.0 | Reactive extensions |

## Architecture

### Application Structure

```
Host Application (src/)
├── main.ts                    → bootstrapApplication(AppComponent, appConfig)
├── app.config.ts              → provideRouter(routes), provideAnimationsAsync()
├── app.routes.ts              → Lazy-loaded routes for dashboard and products
├── store/product.store.ts     → NgRx Signal Store (singleton)
└── features/
    ├── product/               → Product CRUD with Signal Store
    ├── layout/                → Navbar, Sidebar, Footer
    └── dashboard/             → Analytics dashboard with charts

MFE Remote (projects/mfe-dashboard/)
├── main.ts                    → Standalone bootstrap
├── app.routes.ts              → MFE-specific child routes
└── features/dashboard/        → Dashboard components (mirrors host)
```

### State Management Flow

The application uses NgRx Signal Store (`@ngrx/signals`) instead of traditional Actions/Reducers:

```
UI Component → Signal Store Method → patchState() → Computed Signals → Template
```

1. **Component** calls a store method (e.g., `addProduct()`)
2. **Store method** uses `patchState()` to immutably update state
3. **Computed signals** automatically recalculate derived values
4. **Template** re-renders with updated signal values

### Current State Shape

```typescript
interface ProductState {
  products: Product[];    // Array of products
  loading: boolean;       // Loading indicator
  error: string | null;   // Error message
}

interface Product {
  name: string;
  price: number;
}
```

## Key Files

### Core Files

| File | Purpose |
|---|---|
| `src/main.ts` | Application entry point |
| `src/app/app.config.ts` | Provider configuration (router, animations) |
| `src/app/app.routes.ts` | Top-level route definitions |
| `src/app/store/product.store.ts` | NgRx Signal Store definition |
| `src/app/product/product.model.ts` | Product interface |

### Components

| File | Purpose |
|---|---|
| `src/app/app.component.ts` | Root shell with Material sidenav |
| `src/app/product/product.component.ts` | Product CRUD form and table |
| `src/app/layout/navbar/navbar.component.ts` | Fixed top toolbar |
| `src/app/layout/sidebar/sidebar.component.ts` | Side navigation |
| `src/app/layout/footer/footer.component.ts` | App footer |

### Dashboard

| File | Purpose |
|---|---|
| `src/app/dashboard/features/dashboard/dashboard.component.ts` | Dashboard shell layout |
| `src/app/dashboard/features/stats-cards/stats-cards.component.ts` | KPI metric cards |
| `src/app/dashboard/features/charts/charts.component.ts` | Chart.js charts |
| `src/app/dashboard/features/data-grid/data-grid.component.ts` | Material data table |
| `src/app/dashboard/features/activity-feed/activity-feed.component.ts` | Activity timeline |
| `src/app/dashboard/core/services/dashboard-data.service.ts` | Mock data service |
| `src/app/dashboard/core/models/analytics.model.ts` | TypeScript interfaces |

### MFE Remote

| File | Purpose |
|---|---|
| `projects/mfe-dashboard/src/main.ts` | MFE entry point |
| `projects/mfe-dashboard/src/app/app.config.ts` | MFE configuration |
| `projects/mfe-dashboard/src/app/app.routes.ts` | MFE child routes |

## Conventions

### NgRx Signal Store Pattern

```typescript
// 1. Define state interface
export interface ProductState {
  products: Product[];
}

// 2. Create store with composable features
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState<ProductState>(initialState),
  withComputed((store) => ({
    count: computed(() => store.products().length),
  })),
  withMethods((store) => ({
    addItem(item: Product) {
      patchState(store, (state) => ({
        products: [...state.products, item],
      }));
    },
  }))
);
```

### Standalone Component Pattern

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MatCardModule],  // Import directly
  template: `...`,
  styles: [`...`]
})
export class ExampleComponent {
  private store = inject(ProductStore);  // Use inject()
}
```

### Angular 17 Control Flow

```html
<!-- @for replaces *ngFor -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- @if/@else replaces *ngIf -->
@if (isLoading()) {
  <mat-spinner />
} @else {
  <div>Content</div>
}
```

## Component Responsibilities

### ProductComponent
- Collects product name and price from form inputs
- Validates form using computed signals
- Adds products via `ProductStore.addProduct()`
- Removes products via `ProductStore.removeProduct()`
- Shows toast notifications via `MatSnackBar`

### DashboardDataService
- Provides mock data as Angular signals
- Computes derived data (stats cards configuration)
- Formats relative timestamps (`timeAgo()`)

### ChartsComponent
- Creates three Chart.js charts (line, doughnut, bar)
- Uses `@ViewChild` to access canvas elements
- Initializes charts in `ngAfterViewInit()` lifecycle hook

## Commands

| Command | Description |
|---|---|
| `ng serve` | Start host dev server (http://localhost:4200) |
| `ng serve mfe-dashboard` | Start MFE dev server |
| `ng build` | Production build of host app |
| `ng build mfe-dashboard` | Production build of MFE |
| `ng test` | Run unit tests via Karma |
| `ng generate component <name>` | Generate new component |
| `ng generate service <name>` | Generate new service |

## Testing

The project uses Karma/Jasmine for unit testing:

```bash
# Run tests
ng test

# Run tests in headless Chrome
ng test --browsers=ChromeHeadless

# Run tests once (no watch mode)
ng test --watch=false
```

## Notes for Future Changes

- **NgRx Signal Store** is the primary state management pattern; avoid adding Actions/Reducers
- All components are standalone; never create NgModules
- Use `inject()` instead of constructor injection
- Use Angular 17 control flow (`@for`, `@if`) instead of structural directives
- Keep the MFE dashboard components in sync with the host dashboard
- The `app.state.ts` file is legacy and can be removed once all references are migrated
