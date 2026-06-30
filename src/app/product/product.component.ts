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
