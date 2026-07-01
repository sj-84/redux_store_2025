# Angular SSR Server Flow (server.ts)

## The Big Picture

```
Browser Request → Express Server → Static file? → Serve directly
                                  → Page route?  → Angular renders to HTML → Send HTML back
```

## Step-by-Step Flow

### 1. Imports (lines 1-22)

Loads dependencies:
- `zone.js/node` — Angular's async tracking (required for SSR)
- `CommonEngine` — Angular's SSR renderer
- `express` — HTTP server
- `fs`, `path` — Node file system utilities
- `bootstrap` — Angular's server-side entry point

### 2. `app()` function (lines 26-81) — Builds the server

| Line | What it does |
|------|--------------|
| 28 | `express()` — creates server instance |
| 31 | Sets path to compiled Angular output (`dist/angular-ngrx/browser`) |
| 35-37 | Finds `index.html` template |
| 40 | Creates `CommonEngine` (Angular SSR engine) |
| 50-52 | **Static middleware** — serves `.js`, `.css`, images directly from disk |
| 55-77 | **SSR route handler** — renders Angular to HTML for page routes |

### 3. SSR Route Handler (lines 55-77) — The core logic

This is what happens for any page request (e.g. `/products`):

1. **Extract request info** — protocol, URL, host, headers
2. **Call `commonEngine.render()`** with:
   - `bootstrap` — Angular's server entry point
   - `documentFilePath` — path to `index.html` template
   - `url` — full URL so Angular router knows which page to render
   - `publicPath` — where compiled assets live
   - `providers` — sets `APP_BASE_HREF` for routing
3. **Angular renders** — bootstraps app, runs router, renders components to HTML string
4. **Send HTML** — returns rendered HTML to browser
5. **Handle errors** — if something fails, pass to Express error handler

### 4. `run()` function (lines 84-96) — Starts the server

```
Reads PORT from environment → calls app() → server.listen(port) → prints "Server running"
```

### 5. Entry guard (lines 100-108) — Only runs if executed directly

```
Is this file run directly (node server.js)?
  YES → call run()
  NO  → don't start (it's being imported by something else)
```

## Request Flow Example

```
1. User visits http://localhost:4000/products

2. Express receives GET /products

3. Static middleware checks: is it a .js/.css/image file?
   → No, it's a page route

4. SSR route handler catches it:
   → Calls CommonEngine.render({ url: "http://localhost:4000/products" })

5. Angular:
   → Bootstraps the app
   → Router matches /products
   → ProductComponent renders
   → Returns HTML string

6. Express sends HTML back to browser

7. Browser displays the page (hydrates with JS client-side)
```
