import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// [SSR CHANGE]: Configuration file for server-side application bootstrapping.
const serverConfig: ApplicationConfig = {
  providers: [
    // Registers services required for server-side rendering execution
    provideServerRendering()
  ]
};

// Merges the primary appConfig (router, hydration, animation) with server-specific providers
export const config = mergeApplicationConfig(appConfig, serverConfig);
