import { Component, signal, afterNextRender, inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-ssr-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="ssr-container">
      <!-- Header Banner -->
      <div class="ssr-header-banner">
        <div class="header-content">
          <mat-icon class="header-icon">cloud_queue</mat-icon>
          <div class="title-area">
            <h1>Server-Side Rendering (SSR)</h1>
            <span class="subtitle">Real-time compilation and client-side hydration architecture</span>
          </div>
        </div>
      </div>

      <!-- Main Overview Grid -->
      <div class="ssr-grid">
        <!-- Card 1: Server rendering information -->
        <mat-card class="ssr-card server-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar server-avatar">
              <mat-icon>dns</mat-icon>
            </div>
            <mat-card-title>Rendered on Server</mat-card-title>
            <mat-card-subtitle>Node.js execution metrics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="card-body">
            <p class="description-text">
              This component was executed and converted to static HTML on the Node.js server before it reached your browser.
            </p>
            <div class="metric-container">
              <div class="metric-label">Server Timestamp</div>
              <div class="metric-value">{{ serverRenderTime }}</div>
            </div>
            <div class="info-alert">
              <mat-icon class="alert-icon">info</mat-icon>
              <span>This timestamp is static. It shows the exact second the Node.js server finished generating this page.</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Card 2: Hydration & Browser Status -->
        <mat-card class="ssr-card browser-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar browser-avatar" [class.active]="isBrowser()">
              <mat-icon>{{ isBrowser() ? 'devices' : 'hourglass_empty' }}</mat-icon>
            </div>
            <mat-card-title>Client Hydration</mat-card-title>
            <mat-card-subtitle>Browser takeover and event binding</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="card-body">
            <div class="status-badge" [class.hydrated]="isBrowser()">
              <mat-icon>{{ isBrowser() ? 'check_circle' : 'cached' }}</mat-icon>
              <span>{{ isBrowser() ? 'Fully Hydrated & Active' : 'Waiting for Hydration...' }}</span>
            </div>
            
            <div class="api-list">
              <div class="api-item">
                <mat-icon class="api-icon">fingerprint</mat-icon>
                <div class="api-details">
                  <span class="api-title">Navigator UserAgent</span>
                  <span class="api-value">{{ userAgent() }}</span>
                </div>
              </div>

              <div class="api-item">
                <mat-icon class="api-icon">storage</mat-icon>
                <div class="api-details">
                  <span class="api-title">LocalStorage Count</span>
                  <span class="api-value">{{ localStorageValue() }}</span>
                </div>
              </div>
            </div>
            
            <div class="actions-row">
              <button mat-raised-button color="primary" (click)="incrementCounter()" [disabled]="!isBrowser()">
                <mat-icon>add</mat-icon> Trigger Browser Event (Clicks: {{ clickCount() }})
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Row 2: Dynamic Chart Visualization -->
      <div class="chart-section">
        <mat-card class="ssr-card full-width">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar chart-avatar">
              <mat-icon>insert_chart</mat-icon>
            </div>
            <mat-card-title>SSR-Safe Browser Graphics</mat-card-title>
            <mat-card-subtitle>Dynamic import of Chart.js inside afterNextRender()</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="card-body">
            <p class="description-text">
              Chart.js references browser-only canvas rendering APIs. To prevent server compilation and execution errors, the entire Chart.js bundle is lazily loaded via dynamic <code>import()</code> inside Angular's <code>afterNextRender()</code> hook.
            </p>
            <div class="chart-container-wrapper">
              @if (!isBrowser()) {
                <div class="chart-skeleton">
                  <mat-icon class="skeleton-icon">hourglass_empty</mat-icon>
                  <span>Loading Chart.js engine in the browser...</span>
                </div>
              }
              <canvas #demoChart class="ssr-demo-canvas"></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Explanation and Code block -->
      <mat-card class="ssr-card info-card">
        <mat-card-header>
          <mat-card-title>How is this implemented?</mat-card-title>
        </mat-card-header>
        <mat-card-content class="card-body">
          <p>
            To prevent server crashes on browser-only code, we use Angular 17's <code>afterNextRender()</code> lifecycle hook. Here is the architecture of this page:
          </p>
          <div class="code-snippet-box">
<pre>
<code>// 1. Dynamic imports within afterNextRender
constructor() &#123;
  afterNextRender(async () => &#123;
    // Set browser-only signals
    this.isBrowser.set(true);
    this.userAgent.set(window.navigator.userAgent);
    
    // Safely load and initialize browser-only packages
    const &#123; Chart, registerables &#125; = await import('chart.js');
    Chart.register(...registerables);
    this.initChart(Chart);
  &#125;);
&#125;</code>
</pre>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .ssr-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 8px 4px;
    }

    .ssr-header-banner {
      background: linear-gradient(135deg, #673ab7 0%, #3f51b5 100%);
      padding: 32px 24px;
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 20px rgba(103, 58, 183, 0.15);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .title-area h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 300;
    }

    .ssr-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 840px) {
      .ssr-grid {
        grid-template-columns: 1fr;
      }
    }

    .ssr-card {
      border-radius: 12px !important;
      border: 1px solid rgba(0, 0, 0, 0.05);
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
      overflow: hidden;
    }

    .card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
    }

    .server-avatar {
      background: #ff5722;
    }

    .browser-avatar {
      background: #9e9e9e;
      transition: background-color 0.5s ease;
    }

    .browser-avatar.active {
      background: #4caf50;
    }

    .chart-avatar {
      background: #00bcd4;
    }

    .card-body {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .description-text {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .metric-container {
      background: #fafafa;
      padding: 16px;
      border-radius: 8px;
      border: 1px dashed rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .metric-label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: #ff5722;
      font-family: monospace;
    }

    .info-alert {
      background: rgba(33, 150, 243, 0.08);
      color: #1976d2;
      padding: 12px;
      border-radius: 8px;
      font-size: 12px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      line-height: 1.4;
    }

    .alert-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      width: fit-content;
      background: #eceff1;
      color: #546e7a;
      transition: all 0.3s ease;
    }

    .status-badge.hydrated {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .api-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .api-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fafafa;
      padding: 10px 12px;
      border-radius: 8px;
    }

    .api-icon {
      color: #673ab7;
      margin-top: 2px;
    }

    .api-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      word-break: break-all;
    }

    .api-title {
      font-size: 11px;
      color: #888;
      font-weight: 600;
      text-transform: uppercase;
    }

    .api-value {
      font-size: 13px;
      color: #333;
      font-family: monospace;
    }

    .actions-row {
      margin-top: 8px;
    }

    .actions-row button {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
    }

    .chart-section {
      margin-top: 8px;
    }

    .chart-container-wrapper {
      position: relative;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.06);
      padding: 16px;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ssr-demo-canvas {
      width: 100% !important;
      height: 240px !important;
    }

    .chart-skeleton {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #888;
      font-size: 14px;
    }

    .skeleton-icon {
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .info-card {
      background: #fdfdfd;
    }

    .code-snippet-box {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Consolas', 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
    }

    .code-snippet-box code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
  `]
})
export class SsrOverviewComponent {
  // [SSR VERIFICATION]: PLATFORM_ID represents whether the app is executing in the browser or node server.
  // Although we use afterNextRender here, this token is useful for condition checks with isPlatformBrowser(this.platformId)
  private platformId = inject(PLATFORM_ID);
  
  // [DOM REFERENCE]: ElementRef to the canvas. In SSR, this will be undefined or empty on the server
  // and will only resolve to a real HTMLCanvasElement once loaded in the browser.
  @ViewChild('demoChart') demoChartRef!: ElementRef<HTMLCanvasElement>;

  // [SERVER TIMESTAMP]: Holds the time string. Since it's set in the constructor during server rendering,
  // the HTML sent to the browser will freeze this exact value, serving as proof of server execution.
  serverRenderTime: string;

  // [HYDRATION STATE SIGNAL]: Tracks browser presence. Starts 'false' on server rendering,
  // and turns 'true' on the client once hydration completes. Controls the green UI status badge.
  isBrowser = signal(false);

  // [BROWSER GLOBAL SIGNALS]: Safely hold browser data. Initialized with placeholder text so that
  // the server-side generated HTML displays a loading/evaluating state.
  userAgent = signal('Evaluating on Server...');
  localStorageValue = signal('Checking localStorage...');
  clickCount = signal(0);

  constructor() {
    // [SSR EXECUTION]: This runs on the Node server during SSR. We capture the server timestamp here.
    // When the client hydrates, it preserves this value instead of re-evaluating it, avoiding flash.
    this.serverRenderTime = new Date().toLocaleTimeString();

    // [SSR LIFECYCLE HOOK]: afterNextRender() is an Angular 17+ lifecycle hook that is guaranteed
    // to NEVER execute on the Node.js server. It only runs in the browser after the initial rendering.
    // Placing all browser-specific and window-dependent APIs inside this callback prevents server crashes.
    afterNextRender(async () => {
      // 1. Mark browser presence as active (changes the visual badge from Cached to Hydrated)
      this.isBrowser.set(true);

      // 2. Safe browser global call: navigator does not exist in Node, but here it is guaranteed safe.
      this.userAgent.set(window.navigator.userAgent);

      // 3. Safe storage access: localStorage does not exist in Node, but is fully accessible here.
      try {
        const count = Number(localStorage.getItem('ssr_overview_visits') || '0') + 1;
        localStorage.setItem('ssr_overview_visits', count.toString());
        this.localStorageValue.set(`Visits recorded: ${count}`);
      } catch (e) {
        this.localStorageValue.set('localStorage not accessible.');
      }

      // 4. [DYNAMIC IMPORT FOR SSR SAFETY]: Chart.js uses document and canvas rendering contexts on load.
      // Importing it at the top of the file would cause compilation or initialization crashes in Node.
      // By using dynamic ES imports (await import('chart.js')) inside the browser-only hook, we completely
      // isolate it from the server, preventing ReferenceErrors and reducing server bundle size.
      try {
        const { Chart, registerables } = await import('chart.js');
        // Register necessary chart engines (elements, scales, tooltips)
        Chart.register(...registerables);
        // Draw the visualization
        this.initChart(Chart);
      } catch (err) {
        console.error('Failed to load Chart.js library dynamically', err);
      }
    });
  }

  // Click handler triggered by the browser button. Enabled only when isBrowser() is true.
  incrementCounter() {
    this.clickCount.update(c => c + 1);
  }

  // Draw chart in the canvas context (Only called in browser environment after dynamic import resolves)
  private initChart(Chart: any) {
    // Get rendering context of the HTML canvas element
    const ctx = this.demoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create the Chart.js instance using the dynamically loaded module
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['FCP (Without SSR)', 'FCP (With SSR)', 'Hydration Time', 'Server Render Time'],
        datasets: [{
          label: 'Performance Metric (ms) - Lower is Better',
          data: [1800, 350, 150, 45],
          backgroundColor: [
            'rgba(244, 67, 54, 0.8)',   // Red
            'rgba(76, 175, 80, 0.8)',   // Green
            'rgba(33, 150, 243, 0.8)',  // Blue
            'rgba(103, 58, 183, 0.8)'   // Purple
          ],
          borderColor: [
            '#f44336',
            '#4caf50',
            '#2196f3',
            '#673ab7'
          ],
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}
