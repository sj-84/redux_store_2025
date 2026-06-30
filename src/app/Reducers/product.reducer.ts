import { Product } from './../product/product.model'; // Import the Product type so the reducer knows what kind of data it is handling.
export const ADD_PRODUCT = 'ADD_PRODUCT'; // A string constant for the action type. This helps avoid typos.

import { loadItemsWithExtra } from './../product/Actions/product.action'; // Import the action creator so the reducer can recognize its type.

export function addProductReducer(state: Product[] = [], action: { type: string; payload?: Product }): Product[] { /* This is the reducer function.
    It receives the current state and an action, then decides how the state should change. */
  switch (action.type) { // The reducer uses a switch statement to check the action type.
    case ADD_PRODUCT: // When the action type is ADD_PRODUCT, add the new product to the state array.
      return [...state, action.payload as Product]; /* Create a new array using the old items plus the new product.
        This is important because NgRx state should be updated immutably. */

    case 'Wrong_case': // This case is intentionally wrong to show what happens with an unknown action.
      console.error('Invalid action type: Wrong_case'); // Print an error to the console for debugging.
      return state; // Return the same state unchanged.

    case '[Items] Load Items': // This action type is used by the showAll method.
      return state; // Return the current state unchanged for this example.

    case loadItemsWithExtra.type: // When the typed action creator is dispatched, this branch runs.
      return [...state]; // Return a copy of the array so the state stays an array.

    default: // If no case matches, return the current state.
      return state; //Returns the unchanged state.
  }
}

//ACTION AND REDUCER COMPRESSED INTO ONE FILE

/* export function loadReducer(state: Product[] = []) { 
    case 
    return state;
    
} */