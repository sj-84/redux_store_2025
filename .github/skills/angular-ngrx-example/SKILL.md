---
name: angular-ngrx-example
description: Guidance for working in the Angular 17 + NgRx Signal Store + MFE example application.
applyTo: "src/**"
---

# Angular NgRx MFE Example Skill

## What this project does

This is an Angular 17 application demonstrating:
- **NgRx Signal Store** (`@ngrx/signals`) for reactive state management
- **Micro-Frontend (MFE) architecture** with a host shell and remote dashboard
- **Standalone components** (no NgModules)
- **Angular Material** for UI components
- **Chart.js** for data visualization

## Key files

### Host Application
- `src/main.ts` — Application bootstrap entry point
- `src/app/app.config.ts` — Providers (router, animations)
- `src/app/app.routes.ts` — Lazy-loaded routes (dashboard, products)
- `src/app/store/product.store.ts` — **NgRx Signal Store** (core state management)
- `src/app/product/product.model.ts` — Product interface
- `src/app/product/product.component.ts` — Product CRUD component
- `src/app/app.component.ts` — Root shell with Material sidenav

### Dashboard
- `src/app/dashboard/core/services/dashboard-data.service.ts` — Mock data service with signals
- `src/app/dashboard/core/models/analytics.model.ts` — TypeScript interfaces
- `src/app/dashboard/features/dashboard/dashboard.component.ts` — Dashboard layout shell
- `src/app/dashboard/features/stats-cards/stats-cards.component.ts` — KPI metric cards
- `src/app/dashboard/features/charts/charts.component.ts` — Chart.js charts
- `src/app/dashboard/features/data-grid/data-grid.component.ts` — Material data table
- `src/app/dashboard/features/activity-feed/activity-feed.component.ts` — Activity timeline

### MFE Remote
- `projects/mfe-dashboard/src/main.ts` — MFE bootstrap
- `projects/mfe-dashboard/src/app/app.routes.ts` — MFE child routes
- `projects/mfe-dashboard/src/app/core/services/dashboard-data.service.ts` — MFE data service

## Important conventions

### NgRx Signal Store Pattern
```typescript
// Use signalStore with composable features (not Actions/Reducers)
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

### Standalone Components
- All components use `standalone: true`
- Import dependencies directly in the `imports` array
- Use `inject()` for dependency injection (not constructors)

### Angular 17 Control Flow
- Use `@for (item of items(); track item.id)` instead of `*ngFor`
- Use `@if (condition())` instead of `*ngIf`
- Use `@else` for else branches

### State Management Rules
- Never use traditional NgRx Actions/Reducers — use Signal Store only
- Use `patchState()` for immutable state updates
- Use `computed()` for derived values
- Use `signal()` for local component state

### Routing
- Use `loadChildren` for lazy-loaded feature modules
- Use `loadComponent` for standalone component lazy loading
- Dashboard and Products are lazy-loaded from the host shell

## Typical workflow

1. To add a new feature component:
   - Create the component with `standalone: true`
   - Import Angular Material modules as needed
   - Use `inject()` to access services and stores

2. To add new state:
   - Define a state interface in the store file
   - Add `withState`, `withComputed`, `withMethods` to the store
   - Access store signals in components via `inject(ProductStore)`

3. To add a new dashboard feature:
   - Create the component in `src/app/dashboard/features/`
   - Add mock data to `DashboardDataService` as a signal
   - Import and use the component in `DashboardComponent`

4. To modify the MFE:
   - Edit components in `projects/mfe-dashboard/src/app/features/`
   - Keep in sync with the host dashboard components
   - The MFE can run standalone or be loaded via Module Federation

## Verification commands

- `npm run build` — Verify the build succeeds
- `ng test --watch=false --browsers=ChromeHeadless` — Run unit tests
- `ng serve` — Start the host dev server
- `ng serve mfe-dashboard` — Start the MFE dev server
