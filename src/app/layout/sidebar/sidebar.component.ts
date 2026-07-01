import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <!-- Sidebar header with logo icon and brand text -->
    <div class="sidebar-header">
      <mat-icon class="logo-icon">storefront</mat-icon>
      <span class="logo-text">NgRx MFE</span>
    </div>

    <!-- Navigation list using Angular Material's mat-nav-list -->
    <mat-nav-list>
      <!-- Dashboard link: uses routerLinkActive to highlight when active -->
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>

      <!-- Products link -->
      <a mat-list-item routerLink="/products" routerLinkActive="active-link">
        <mat-icon matListItemIcon>inventory_2</mat-icon>
        <span matListItemTitle>Products</span>
      </a>

      <!-- SSR Overview link -->
      <a mat-list-item routerLink="/ssr-overview" routerLinkActive="active-link">
        <mat-icon matListItemIcon>cloud_queue</mat-icon>
        <span matListItemTitle>SSR Overview</span>
      </a>

      <!-- Visual divider between navigation sections -->
      <mat-divider></mat-divider>

      <!-- Analytics link (placeholder - not yet routed) -->
      <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
        <mat-icon matListItemIcon>analytics</mat-icon>
        <span matListItemTitle>Analytics</span>
      </a>

      <!-- Settings link (placeholder - not yet routed) -->
      <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Settings</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.12);
    }
    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #673ab7;  /* Purple accent matching the app theme */
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }
    .active-link {
      background: rgba(103, 58, 183, 0.08) !important;  /* Purple tint for active state */
      color: #673ab7 !important;
    }
    .active-link mat-icon {
      color: #673ab7 !important;
    }
  `]
})
export class SidebarComponent {}
