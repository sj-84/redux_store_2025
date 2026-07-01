# Angular Server-Side Rendering (SSR) & Hydration Guide

Welcome to the SSR documentation! This guide is written assuming you are completely new to Server-Side Rendering (SSR) in Angular. It explains the concepts in detail, how the infrastructure works, and provides a walk-through of the code we added.

---

## 1. Core Concepts: CSR vs. SSR

To understand SSR, let's first look at how standard Angular apps run.

### Client-Side Rendering (CSR) - The Traditional Way
1. **Request:** The user goes to your website.
2. **Server Response:** The server sends back a nearly empty `index.html` file that looks like this:
   ```html
   <body>
     <app-root></app-root> <!-- Empty shell -->
     <script src="main.js"></script> <!-- Large JavaScript bundle -->
   </body>
   ```
3. **Execution:** The browser downloads the `main.js` file, parses the code, executes it, and *then* builds the visual page.
4. **Pros/Cons:** 
   - 🔴 **Blank screen:** The user sees a blank screen (or loading spinner) until the JavaScript finishes downloading and running.
   - 🔴 **Poor SEO:** Search engine crawlers (like Google or Bing) might read a blank page if their bots don't wait for JavaScript to execute.

### Server-Side Rendering (SSR) - The Modern Way
1. **Request:** The user goes to your website.
2. **Server Execution:** The request is received by a **Node.js server**. The server bootstrapper executes the Angular application in memory, renders the components into actual HTML text, and places it inside the `<body>`.
3. **Server Response:** The server sends back a fully populated `index.html` file:
   ```html
   <body>
     <app-root>
       <div class="dashboard">
         <h1>Dashboard</h1>
         <p>Total Products: 12</p>
       </div>
     </app-root>
     <script src="main.js"></script>
   </body>
   ```
4. **Instant View:** The browser receives this HTML and immediately displays it to the user. The user sees a fully styled page instantly.
5. **Pros/Cons:**
   - 🟢 **Immediate visual load:** Excellent user experience (low First Contentful Paint).
   - 🟢 **SEO Friendly:** Search engine indexers read full text content immediately.

---

## 2. What is Client Hydration?

When the server sends pre-rendered HTML, it is **non-interactive** (just text and styles). If a user clicks a button, nothing will happen because there are no JavaScript event listeners attached to the DOM elements yet.

**Hydration** is the process where Angular:
1. Downloads the client JavaScript bundles (`main.js`, etc.) in the background.
2. Bootstraps the application on the browser.
3. Scans the server-rendered HTML elements in the DOM.
4. **Hydrates** the elements by attaching event listeners (like click handlers, inputs) and connecting them to component variables without destroying and re-rendering the HTML.

After hydration completes, the website becomes fully interactive. In Angular 17+, hydration is enabled by calling `provideClientHydration()` in the application configuration.

---

## 3. The Runtime Environment Challenge

One of the biggest hurdles when implementing SSR is that your Angular code now runs in **two completely different environments**:

| Feature | Node.js Server (SSR Build) | Browser (Client Build) |
|---|---|---|
| **OS Access** | Direct access to file system, environment variables | Sandboxed in browser |
| **Browser Globals** | ❌ No `window`, `document`, `navigator` | 🟢 Has `window`, `document`, `navigator` |
| **DOM Elements** | ❌ No physical DOM (uses a virtual DOM template) | 🟢 Has physical DOM elements |
| **Browser Storage** | ❌ No `localStorage`, `sessionStorage`, `cookies` | 🟢 Has storage access |
| **Canvas APIs** | ❌ No `<canvas>` context, no 2D/3D drawing context | 🟢 Has hardware-accelerated canvas |

### Why this causes crashes
If you have a component that does this:
```typescript
ngOnInit() {
  const token = localStorage.getItem('token');
  console.log(window.location.href);
}
```
It will run perfectly in the browser. But when Node.js runs this component to pre-render the page on the server, it will throw `ReferenceError: localStorage is not defined` or `ReferenceError: window is not defined` and the server will crash.

---

## 4. How We Safely Handle Browser-Only Code

In our new page `/ssr-overview`, we wanted to display browser stats (like user agent and `localStorage`) and render a **Chart.js** chart. Chart.js draws graphics directly on an HTML5 `<canvas>` which requires document objects.

We solved this using two modern Angular patterns:

### Method A: `afterNextRender()`
Angular 17 introduced the `afterNextRender()` hook.
- Any code placed inside `afterNextRender()` **never runs on the Node server**.
- It is guaranteed to run **only in the browser**, and **only after the first page render is complete** (when the page is hydrated).

```typescript
import { Component, afterNextRender } from '@angular/core';

@Component({ ... })
export class MyComponent {
  constructor() {
    afterNextRender(() => {
      // Safe to use window, document, localStorage here!
      console.log(window.location.href);
    });
  }
}
```

### Method B: Dynamic Imports for SSR Safety
Even if you use `afterNextRender()`, if you import a library like Chart.js at the top of your file:
```typescript
import { Chart } from 'chart.js'; // Top level import
```
The Node.js server compilation process still loads the `chart.js` module. If the library itself runs initialization code checking for browser objects when it loads, it will crash your server.

The solution is **Dynamic Import**:
```typescript
afterNextRender(async () => {
  // Dynamically import the library only inside the browser hook
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);
  // Now instantiate your chart!
});
```
This ensures the server never loads or compiles the Chart.js code, making it 100% server-safe.

---

## 5. File-by-File Breakdown of SSR Integration

Here are the files we added and modified to support SSR, explained line-by-line:

### 1. `server.ts` (Express Node Server)
This is a standard Node.js server using Express.
- It receives requests from clients.
- If the request is for a static asset (like an image or a CSS stylesheet), it serves it from the browser directory.
- If it is a web page request (like `/dashboard` or `/ssr-overview`), it calls Angular's `CommonEngine.render()` function to compile the HTML page dynamically in Node.js and return it.

### 2. `src/main.server.ts` (Server Bootstrap)
This is the entry point that Node.js uses to load Angular. It exports a function that bootstraps the root `AppComponent` using the server configuration `appConfigServer`.

### 3. `src/app/app.config.server.ts` (Server Configuration)
This config extends the client configuration (`appConfig`) and merges it with `provideServerRendering()`. This tells Angular how to handle server-side compilation.

### 4. `src/app/app.config.ts` (Client Configuration)
We added `provideClientHydration()` to the providers array. This tells the browser Angular app to *hydrate* the HTML sent by the server rather than rebuilding the page from scratch.

### 5. `src/app/ssr-overview/ssr-overview.component.ts` (The Showcase Page)
Let's look at the core logic:
- `serverRenderTime`: Initialized in the constructor. Because the constructor runs during the server build, it captures the server rendering timestamp (which doesn't change on the client).
- `isBrowser = signal(false)`: A reactive signal that starts as `false` (on the server) and becomes `true` inside `afterNextRender()`.
- `afterNextRender()` callback:
  1. Sets `isBrowser` to `true` (updates the UI status badge to "Fully Hydrated").
  2. Reads `window.navigator.userAgent` and sets it in a signal.
  3. Increments a visit counter in `localStorage` and updates the signal.
  4. Dynamically imports `chart.js` and builds the bar chart.

### 6. `angular.json` (Build configuration)
- Configured a new builder targets: `"server"`, `"serve-ssr"`, and `"prerender"`.
- Under production configurations, we added:
  ```json
  "optimization": {
    "scripts": true,
    "styles": {
      "minify": true,
      "inlineCritical": true
    },
    "fonts": {
      "inline": false
    }
  }
  ```
  *Note:* Setting `"fonts": { "inline": false }` disables the automatic downloading/inlining of Google Fonts during build, preventing SSL/Certificate validation crashes on corporate firewalls.

---

## 6. How to Build & Run the SSR App

### Build the Application
To build both the client and server assets, run:
```bash
npm run build:ssr
```
This compiles two directories inside `dist/angular-ngrx/`:
- `browser/`: Static files served directly to users.
- `server/`: Node.js server scripts including the Express router.

### Run the Server Locally
To start the compiled Express server, run:
```bash
npm run serve:ssr
```
The server will start listening at:
`http://localhost:4000`

### Verify SSR is Working
1. Start the server and navigate to `http://localhost:4000/ssr-overview`.
2. Right-click on the page and select **View Page Source** (or press `Ctrl + U`).
3. Scroll down and examine the markup. You will see:
   - Complete pre-rendered HTML cards containing the title, layout, and instructions.
   - The server timestamp rendered directly into the HTML text.
   - An `<script id="ng-state">` block containing state transfer data.
   - *If you saw a blank page source like `<app-root></app-root>`, it would mean SSR is not working. Here, you see full content, proving SSR is active.*
