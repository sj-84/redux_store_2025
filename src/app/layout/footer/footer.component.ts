import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDividerModule, MatIconModule],
  template: `
    <!-- Visual divider at the top of the footer -->
    <mat-divider></mat-divider>

    <!-- Footer content with copyright and tech stack info -->
    <footer class="footer">
      <span>NgRx MFE Store &copy; 2026</span>
      <span class="spacer"></span>
      <mat-icon class="footer-icon">favorite</mat-icon>
      <span>Built with Angular 17 + NgRx Signal Store</span>
    </footer>
  `,
  styles: [`
    .footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 24px;
      color: rgba(0,0,0,0.54);  /* Muted text color */
      font-size: 13px;
    }
    .spacer {
      flex: 1 1 auto;  /* Pushes content to edges */
    }
    .footer-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #e91e63;  /* Pink heart icon */
    }
  `]
})
export class FooterComponent {}
