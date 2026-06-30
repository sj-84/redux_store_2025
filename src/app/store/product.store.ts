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
