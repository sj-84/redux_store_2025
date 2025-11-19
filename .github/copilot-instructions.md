# Copilot Instructions for `angular-ngrx-example`

## Project Overview
- **Framework:** Angular 16 with NgRx for state management
- **Main Domain:** Product management (see `src/app/product/`)
- **State Management:** Uses NgRx Store, with a single state slice: `product`
- **Entry Point:** `src/main.ts` → `AppModule` (`src/app/app.module.ts`)

## Key Architectural Patterns
- **NgRx Store:**
  - Registered in `AppModule` via `StoreModule.forRoot({ product: addProductReducer })`.
  - State interface: `AppState` in `app.state.ts` (`readonly product: Product[]`).
  - Actions are defined using `createAction` (see `product/Actions/product.action.ts`).
  - Reducer logic in `Reducers/product.reducer.ts` (handles action types, including constants and `createAction` types).
- **Product Model:** Defined in `product/product.model.ts`.
- **Component:** Main UI logic in `product/product.component.ts`.

## Developer Workflows
- **Start Dev Server:** `npm start` or `ng serve` (default: http://localhost:4200/)
- **Build:** `npm run build` or `ng build`
- **Unit Tests:** `npm test` or `ng test` (Karma)
- **Scaffold Components:** `ng generate component <name>`

## Project-Specific Conventions
- **Action Types:**
  - Use string constants (e.g., `ADD_PRODUCT`) and `createAction` for type safety.
  - Action creators may be imported and referenced by `.type` in reducers.
- **Reducers:**
  - Accepts state as `Product[]`, returns new state immutably.
  - Handles both string and `createAction` types.
- **Single State Slice:**
  - Only `product` is registered in the store; expand by adding more keys to `StoreModule.forRoot`.
- **File Structure:**
  - Actions: `src/app/product/Actions/`
  - Reducers: `src/app/Reducers/`
  - Models: `src/app/product/product.model.ts`

## Integration & External Dependencies
- **NgRx:**
  - `@ngrx/store` and `@ngrx/effects` are core dependencies.
  - No custom middleware or effects are present by default.
- **RxJS:** Used for reactive patterns (not heavily customized here).

## Examples
- **Add Product Action:**
  - Define: `export const ADD_PRODUCT = 'ADD_PRODUCT';`
  - Dispatch: `{ type: ADD_PRODUCT, payload: { name, price } }`
- **Reducer Switch:**
  - Handles both string and `createAction` types:
    ```typescript
    case ADD_PRODUCT:
      return [...state, action.payload];
    case loadItemsWithExtra.type:
      return { ...state, extra: true };
    ```

## References
- `README.md`: Basic Angular CLI usage
- `src/app/app.module.ts`: Store setup
- `src/app/Reducers/product.reducer.ts`: Reducer logic
- `src/app/product/Actions/product.action.ts`: Action creators
- `src/app/app.state.ts`: State interface

---
For more, see Angular and NgRx documentation. Update this file as new state slices, effects, or conventions are added.
