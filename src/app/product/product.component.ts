import { Product } from './product.model';
import { AppState } from './../app.state';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {loadItemsWithExtra} from './../product/Actions/product.action';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Observable<Product[]>; //observable of arrays of Product objects.
  showAllTriggered: boolean = false; // Track if 'Show all' action is triggered

  constructor(private store: Store<AppState>) { /* Dependency Injection: Injects Store<AppState> for state management.
    Private Access: Restricts store access within the component.
    Store<AppState>: References the application state store. */ //TODO - --------------EXPLAIN---------
    this.products = this.store.select(state => state.product); /* Store Selection: Retrieves the product state slice using select.
    State.product: Expects AppState to have a product property.
    Assignment: Subscribes to state changes, updating products observable. */
    //console.log(" this.products", this.products)
    this.products.subscribe(ele=>{ //this>products IS THE OBSERVABLE WHICH STORES THE PRODUCT STATE AND UPDATES IT IMMUTIBLY.
      console.log(ele);
    })
   }
  addProduct(name:any, price:any) { //dispatches action - try in a different way
/*     this.store.dispatch({
      type: 'ADD_PRODUCT',
      payload: <Product> {
        name: name,
        price: price
      }
    }); */

    this.store.dispatch({
      type: 'ADD_PRODUCT',
      payload: <Product> {
        name: name,
        price: price
      }
    });
  }

  showAll() {
    this.store.dispatch({ type: '[Items] Load Items' });
    this.store.select(state => state.product).subscribe(products => {
      if (products.length > 0) {
        this.showAllTriggered = true; // Set flag after reducer updates the state
      }
    });
  }

  showAllWrong() {
    this.store.dispatch({type:'Wrong_case'})
  }

  showAllExtra() {
    this.store.dispatch(loadItemsWithExtra()) //calling the type safe action function
  }

  ngOnInit() {
  }
}

//Question - how to use this state?
//try with different states