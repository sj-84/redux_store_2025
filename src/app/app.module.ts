import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { StoreModule } from '@ngrx/store';
import { addProductReducer } from './Reducers/product.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({product: addProductReducer}) //for now work with 1 reducer, not sure how to use multiple reducers
  ],
  /*
The line StoreModule.forRoot({product: addProductReducer}) registers NgRx state management in your Angular app. It sets up a single state slice called product, managed by the addProductReducer function. This enables centralized, immutable state for products, allowing actions to update the product state and making it accessible throughout the app. To add more state slices, add more keys to the object passed to forRoot.
  */
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*


StoreModule.forRoot({ product: addProductReducer })
Explanation Breakdown
StoreModule: An NgModule from the @ngrx/store library for configuring the application state store.
forRoot: A static method indicating this configuration is for the root module.
Object Argument: An object defining the store's state structure.
product: A key representing a state slice named "product."
addProductReducer: The value associated with the "product" key, managing its state.
Purpose
Global State Configuration: Configures the global application state.
State Slice Registration: Registers "product" as a managed state slice.
Reducer Assignment: Assigns addProductReducer to manage the "product" state slice.
Impact
Centralized State Management: Enables centralized management of the "product" state.
Action Handling: Allows dispatching actions to modify the "product" state.
Global Accessibility: Makes the "product" state accessible application-wide.
Context
This line typically appears in the application module (app.module.ts) during NgRx store setup in an Angular application.

*/

//TRY CHANGING THE KEY