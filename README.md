# Angular NgRx MFE Example

An Angular 17 + NgRx Signal Store application with a Micro-Frontend (MFE) architecture. Built with standalone components, Angular Material, and Chart.js for a modern dashboard experience.

## Architecture

This project demonstrates:
- **Angular 17 standalone components** (no NgModules)
- **NgRx Signal Store** (`@ngrx/signals`) for reactive state management
- **Micro-Frontend (MFE)** architecture with a host shell and remote dashboard
- **Angular Material** for the UI component library
- **Chart.js** for data visualization (line, doughnut, bar charts)
- **Lazy loading** for feature modules via `loadChildren` and `loadComponent`

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | ^17.3.0 | Framework |
| @ngrx/signals | ^17.1.0 | Signal-based state management |
| Angular Material | ^17.3.0 | UI components |
| Chart.js | ^4.4.0 | Charts and data visualization |
| TypeScript | ~5.3.0 | Language |
| RxJS | ~7.8.0 | Reactive programming |

## Project Structure

```
src/                          # Host (Shell) Application
├── main.ts                   # App bootstrap entry point
├── app/
│   ├── app.component.ts      # Root shell with Material sidenav layout
│   ├── app.config.ts         # Application providers (router, animations)
│   ├── app.routes.ts         # Top-level lazy-loaded routes
│   ├── app.state.ts          # Legacy AppState interface
│   ├── store/
│   │   └── product.store.ts  # NgRx Signal Store (core state management)
│   ├── product/
│   │   ├── product.model.ts  # Product interface definition
│   │   └── product.component.ts  # Product CRUD UI (signals + Material)
│   ├── layout/
│   │   ├── navbar/           # Top toolbar with user menu
│   │   ├── sidebar/          # Side navigation with router links
│   │   └── footer/           # App footer
│   └── dashboard/
│       ├── dashboard.routes.ts       # Child routes for dashboard
│       ├── core/
│       │   ├── models/               # TypeScript interfaces
│       │   └── services/             # Data service with signals
│       └── features/
│           ├── dashboard/            # Dashboard shell layout
│           ├── stats-cards/          # KPI metric cards
│           ├── charts/               # Chart.js visualizations
│           ├── data-grid/            # Material data table
│           └── activity-feed/        # Activity timeline

projects/mfe-dashboard/       # Micro-Frontend Remote Application
└── src/
    ├── main.ts               # MFE bootstrap
    └── app/
        ├── app.component.ts  # MFE root shell
        ├── app.config.ts     # MFE providers
        ├── app.routes.ts     # MFE child routes
        ├── core/             # Shared services and models
        └── features/         # Dashboard feature components (mirrors host)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

### Installation

```bash
npm install
```

### Development Server

```bash
# Start the host application
ng serve

# Start the MFE dashboard (runs on a different port)
ng serve mfe-dashboard
```

Navigate to `http://localhost:4200/`.

### Build

```bash
# Build the host application
ng build

# Build the MFE dashboard
ng build mfe-dashboard
```

### Running Tests

```bash
# Unit tests
ng test

# Build verification
npm run build
```

## Key Concepts

### NgRx Signal Store

The project uses `@ngrx/signals` instead of traditional NgRx Actions/Reducers:

```typescript
// Signal Store with composable features
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState<ProductState>(initialState),
  withComputed((store) => ({
    productCount: computed(() => store.products().length),
  })),
  withMethods((store) => ({
    addProduct(product: Product) {
      patchState(store, (state) => ({
        products: [...state.products, product],
      }));
    },
  }))
);
```

### Standalone Components

All components use Angular 17 standalone architecture:

```typescript
@Component({
  standalone: true,
  imports: [RouterOutlet, MatCardModule, ...],
  template: `...`
})
export class MyComponent {}
```

### Lazy Loading

Routes are lazy-loaded for optimal bundle size:

```typescript
// loadChildren for feature modules
{ path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.routes') }

// loadComponent for standalone components
{ path: 'products', loadComponent: () => import('./product/product.component') }
```

### Angular 17 Control Flow

Templates use the new `@for` and `@if` syntax:

```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

@if (condition()) {
  <span>Visible when true</span>
}
```

## Commands Reference

| Command | Description |
|---|---|
| `ng serve` | Start dev server (host app) |
| `ng serve mfe-dashboard` | Start MFE dev server |
| `ng build` | Production build (host) |
| `ng build mfe-dashboard` | Production build (MFE) |
| `ng test` | Run unit tests |
| `ng generate component <name>` | Generate a new component |
| `ng generate service <name>` | Generate a new service |

## License

MIT
