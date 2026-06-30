# Copilot Instructions for `angular-ngrx-example`

## Project Overview
- **Framework:** Angular 17 with standalone components (no NgModules)
- **State Management:** NgRx Signal Store (`@ngrx/signals`) — modern signal-based approach
- **Architecture:** Micro-Frontend (MFE) with host shell + remote dashboard
- **UI Library:** Angular Material 17
- **Charts:** Chart.js 4.x with ng2-charts
- **Entry Point:** `src/main.ts` → `bootstrapApplication(AppComponent, appConfig)`

## Key Architectural Patterns

### NgRx Signal Store
- **Store file:** `src/app/store/product.store.ts`
- Uses `signalStore()` with composable features: `withState`, `withComputed`, `withMethods`
- State mutations via `patchState()` (immutable updates)
- Computed values via `computed()` for derived state
- No Actions/Reducers — this is the modern Angular 17+ pattern

### Standalone Components
- All components use `standalone: true`
- Dependencies imported directly in component `imports` array
- No `app.module.ts` or NgModules exist
- Use `inject()` for dependency injection

### Lazy Loading
- `loadChildren()` for feature modules (dashboard routes)
- `loadComponent()` for standalone components (product)
- Both patterns use dynamic `import()` for code splitting

### Angular 17 Control Flow
- `@for (item of items(); track item.id)` — replaces `*ngFor`
- `@if (condition())` — replaces `*ngIf`
- `@else` — else branches

## Key Files

| File | Purpose |
|---|---|
| `src/main.ts` | App bootstrap |
| `src/app/app.config.ts` | Providers (router, animations) |
| `src/app/app.routes.ts` | Top-level routes (lazy loading) |
| `src/app/store/product.store.ts` | NgRx Signal Store |
| `src/app/product/product.component.ts` | Product CRUD UI |
| `src/app/product/product.model.ts` | Product interface |
| `src/app/dashboard/core/services/dashboard-data.service.ts` | Dashboard mock data |
| `src/app/dashboard/features/charts/charts.component.ts` | Chart.js charts |
| `projects/mfe-dashboard/src/main.ts` | MFE bootstrap |
| `projects/mfe-dashboard/src/app/app.routes.ts` | MFE routes |

## Developer Workflows

- **Start Dev Server:** `ng serve` (host) or `ng serve mfe-dashboard` (MFE)
- **Build:** `ng build` or `ng build mfe-dashboard`
- **Unit Tests:** `ng test` or `ng test --watch=false --browsers=ChromeHeadless`
- **Scaffold Components:** `ng generate component <name>`

## Project-Specific Conventions

### State Management
- Use `signalStore()` with composable features — never use Actions/Reducers
- Use `patchState()` for state mutations
- Use `computed()` for derived values
- Store is `providedIn: 'root'` (singleton)

### Component Patterns
- All components are standalone
- Use `inject()` instead of constructor injection
- Use `signal()` for local component state
- Use Angular 17 control flow (`@for`, `@if`)

### File Structure
- `src/app/store/` — NgRx Signal Store files
- `src/app/product/` — Product feature module
- `src/app/layout/` — Layout components (navbar, sidebar, footer)
- `src/app/dashboard/` — Dashboard feature with nested structure
  - `core/models/` — TypeScript interfaces
  - `core/services/` — Data services
  - `features/` — Dashboard feature components

### MFE Architecture
- Host app: `src/` (root)
- MFE remote: `projects/mfe-dashboard/`
- MFE can run standalone or be loaded via Module Federation
- Dashboard components are mirrored between host and MFE

## Integration & External Dependencies

- **@ngrx/signals:** Core state management (Signal Store)
- **@ngrx/store, @ngrx/effects:** Listed in package.json but not actively used
- **Angular Material:** UI components (sidenav, toolbar, cards, table, chips, etc.)
- **Chart.js:** Charts and data visualization
- **RxJS:** Reactive patterns (used minimally)

## Examples

### Adding a Store Method
```typescript
withMethods((store) => ({
  addItem(item: Product) {
    patchState(store, (state) => ({
      items: [...state.items, item],
    }));
  },
}))
```

### Accessing Store in a Component
```typescript
export class MyComponent {
  private store = inject(ProductStore);
  items = this.store.items;
  count = this.store.itemCount;
}
```

### Angular 17 Control Flow in Templates
```html
@for (item of items(); track item.id) {
  <mat-card>{{ item.name }}</mat-card>
}
```

## References
- `README.md` — Project overview and getting started
- `PROJECT_DOCUMENTATION.md` — Detailed architecture and conventions
- `src/app/store/product.store.ts` — Signal Store implementation
- `src/app/product/product.component.ts` — Component using Signal Store
- `src/app/dashboard/core/services/dashboard-data.service.ts` — Signal-based data service

---
For more, see Angular and NgRx Signal Store documentation. Update this file as new features or conventions are added.
