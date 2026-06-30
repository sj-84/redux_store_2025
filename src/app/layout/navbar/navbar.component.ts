import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <!-- Fixed top toolbar with brand name, sidebar toggle, and user menu -->
    <mat-toolbar color="primary" class="navbar">
      <!-- Hamburger button: emits toggleSidebar event to parent (AppComponent) -->
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="brand">NgRx MFE Store</span>
      <span class="spacer"></span>

      <!-- User avatar menu trigger -->
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <!-- Dropdown menu with user actions (profile, settings, logout) -->
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <button mat-menu-item>
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;   /* Fixed position so it stays at top during scroll */
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;     /* Above sidenav (z-index 1001 for sidenav) */
    }
    .brand {
      margin-left: 8px;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;   /* Pushes the user menu to the right */
    }
  `]
})
export class NavbarComponent {
  // EventEmitter that notifies the parent component (AppComponent) to toggle the sidenav
  @Output() toggleSidebar = new EventEmitter<void>();
}
