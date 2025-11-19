import { Product } from './../product/product.model';
export const ADD_PRODUCT = 'ADD_PRODUCT'; //Usage: Prevents typos in action types by using this constant.

import {loadItemsWithExtra} from './../product/Actions/product.action';

export function addProductReducer(state: Product[] = [], action :any) { /* Purpose: Manages product state changes.
    Name: addProductReducer.
    Export: Exposes the function for external usage.
    Parameters:
    state: Initial or current product state (array of Product objects).
    action: Object containing action details (type and payload).
    Default State: Initializes state as an empty Product array if none provided. */
  switch (action.type) { //Purpose: Directs execution based on the action type.
    case ADD_PRODUCT:
        return [...state, action.payload]; /* Match: action.type equals 'ADD_PRODUCT'.
        Action: Adds a new product to the state.
        Immutability: Returns a new array by spreading (...) the existing state and appending action.payload (the new product).
        Payload Expectation: action.payload should be a valid Product object. */
    
    case 'Wrong_case':
        console.error('Invalid action type: Wrong_case'); // Log an error for debugging
        return state; // Return the unchanged state


    case '[Items] Load Items':
        return state; // Return the current state to show all items entered by the user

    case loadItemsWithExtra.type:
        return {...state, extra: true};
    
        default:
        return state; //Returns the unchanged state.
    }
}

//ACTION AND REDUCER COMPRESSED INTO ONE FILE

/* export function loadReducer(state: Product[] = []) { 
    case 
    return state;
    
} */