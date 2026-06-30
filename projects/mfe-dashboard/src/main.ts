// Bootstrap the Micro-Frontend (MFE) dashboard application.
// This is the entry point for the standalone MFE remote app.
// It can run independently or be loaded into the host app via Module Federation.
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Standalone bootstrap: same pattern as the host app but with its own routes and config.
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
