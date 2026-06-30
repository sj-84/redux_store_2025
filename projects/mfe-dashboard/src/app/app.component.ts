import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// MFE root shell component.
// Minimal wrapper that renders child routes via <router-outlet>.
// In Module Federation, this component serves as the remote entry point.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
