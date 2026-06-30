// Bootstrap the Angular application using standalone component architecture.
// This is the entry point for the host (shell) application.
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// bootstrapApplication replaces the traditional NgModule bootstrap process.
// It accepts a root standalone component and an application config object
// that provides routing, animations, and other platform-level services.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
