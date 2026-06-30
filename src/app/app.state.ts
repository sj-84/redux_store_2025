import { Product } from './product/product.model';

// Legacy AppState interface.
// Originally used with @ngrx/store's StoreModule.forRoot().
// Now replaced by the NgRx Signal Store (see store/product.store.ts).
// Kept for backward compatibility with any remaining store references.
export interface AppState {
  readonly product: Product[];
}
