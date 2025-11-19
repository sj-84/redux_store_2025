import { createAction, props } from '@ngrx/store';
export const loadItems = createAction('[Items] Load Items');
/* export const addItem = createAction(
    '[Items] Add Item',
    props<{ item: string }>()
  ); */

  export const loadItemsWithExtra = createAction('[Items] Load Items Extra'); //creates a function - createAction is a function in NgRx (Angular’s reactive state management library) used to define actions in a more type-safe, readable, and maintainable way. Actions in NgRx represent events that trigger state changes, and createAction makes it easy to define these events with optional payloads.

//   it returns  - {
//   type: '[Items] Add Item',   // The unique type identifier of the action
//   item: 'New Item'            // The payload, as defined in props
// }