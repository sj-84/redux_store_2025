import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

// Application configuration object that replaces the traditional NgModule providers.
// This is passed to bootstrapApplication() in main.ts to configure the app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Register the application routes defined in app.routes.ts
    provideRouter(routes),
    // Enable Angular Material animations asynchronously (lazy-loaded)
    provideAnimationsAsync(),
    
    // [SSR CHANGE]: Enable non-destructive client-side hydration.
    // This tells Angular to scan the HTML rendered by the Node.js server and attach event
    // listeners to the existing DOM elements, rather than destroying the HTML and re-rendering it.
    // This prevents screen flashing/flicker and keeps the app fast.
    provideClientHydration(),
  ]
};
