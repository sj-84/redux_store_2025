import { createAction, props } from '@ngrx/store'; // Import createAction from NgRx so actions can be written cleanly.
export const loadItems = createAction('[Items] Load Items'); // Create an action with a simple type string.
/* export const addItem = createAction(
    '[Items] Add Item',
    props<{ item: string }>()
  ); */

  export const loadItemsWithExtra = createAction('[Items] Load Items Extra'); // This creates a function that returns an action object with the given type.
  // In NgRx, actions describe what happened in the app, such as "load items" or "add product".

//   it returns  - {
//   type: '[Items] Add Item',   // The unique type identifier of the action
//   item: 'New Item'            // The payload, as defined in props
// }