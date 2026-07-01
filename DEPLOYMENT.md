# Deployment Guide — Angular NgRx MFE to GitHub Pages

## Overview

This guide covers deploying an Angular 17 standalone application to GitHub Pages using GitHub Actions for automatic CI/CD.

**Live Site:** https://sj-84.github.io/redux_store_2025/

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Architecture](#deployment-architecture)
3. [Step 1: Configure Base Href](#step-1-configure-base-href)
4. [Step 2: Create GitHub Actions Workflow](#step-2-create-github-actions-workflow)
5. [Step 3: Enable GitHub Pages](#step-3-enable-github-pages)
6. [Step 4: Push and Deploy](#step-4-push-and-deploy)
7. [How the YAML Workflow Works](#how-the-yaml-workflow-works)
8. [Troubleshooting](#troubleshooting)
9. [Manual Deployment (Alternative)](#manual-deployment-alternative)
10. [Adding the MFE Later](#adding-the-mfe-later)

---

## Prerequisites

| Requirement | Version | Check Command |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 8+ | `npm --version` |
| Angular CLI | 17+ | `ng version` |
| Git | Any | `git --version` |
| GitHub Account | Any | — |

---

## Deployment Architecture

```
Developer pushes to main
         |
         v
GitHub Actions detects .github/workflows/deploy.yml
         |
         +-- Job 1: BUILD (ubuntu-latest)
         |   |-- Checkout code
         |   |-- Setup Node.js 20
         |   |-- npm ci (install dependencies)
         |   |-- ng build --configuration production
         |   |-- Upload dist/angular-ngrx/ as artifact
         |
         +-- Job 2: DEPLOY (ubuntu-latest)
             |-- Download artifact
             |-- Publish to GitHub Pages
             |
             v
         Site live: https://sj-84.github.io/redux_store_2025/
```

---

## Step 1: Configure Base Href

### The Problem

GitHub Pages serves your site from a **subdirectory**, not the root:

```
https://sj-84.github.io/              <-- Root (NOT your site)
https://sj-84.github.io/redux_store_2025/  <-- Your site
```

Without configuring the base href, Angular generates asset paths like:

```html
<!-- WRONG: Browser looks for /main.js at the root -->
<script src="main.abc123.js"></script>
```

### The Solution

Edit `angular.json` and add `baseHref` to the production configuration:

```json
{
  "projects": {
    "angular-ngrx": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "baseHref": "/redux_store_2025/",
              "budgets": [...],
              "outputHashing": "all"
            }
          }
        }
      }
    }
  }
}
```

### What This Does

After building, the output `dist/angular-ngrx/index.html` will contain:

```html
<!doctype html>
<html lang="en">
<head>
  <base href="/redux_store_2025/">
  <!-- ... -->
</head>
<body>
  <app-root></app-root>
  <script src="main.abc123.js"></script>
</body>
</html>
```

The `<base href="/redux_store_2025/">` tag tells the browser:
- All relative URLs start from `/redux_store_2025/`
- So `main.abc123.js` resolves to `/redux_store_2025/main.abc123.js`

### How to Find Your Base Href

Your base href is your **repository name**:

```
Repository: https://github.com/sj-84/redux_store_2025
                                    ^^^^^^^^^^^^^^^^
                                    This is your base href

Base href: /redux_store_2025/
```

If your repo was `sj-84/my-app`, your base href would be `/my-app/`.

---

## Step 2: Create GitHub Actions Workflow

### File Location

```
.github/
  workflows/
    deploy.yml    <-- Create this file
```

### Complete File

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build for GitHub Pages
        run: npm run build -- --configuration production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist/angular-ngrx"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### YAML Breakdown

#### Section 1: Name

```yaml
name: Deploy to GitHub Pages
```

This is the display name shown in the GitHub Actions UI. You can name it anything.

#### Section 2: Triggers

```yaml
on:
  push:
    branches: [main, master]    # Auto-trigger on push to these branches
  workflow_dispatch:             # Allow manual trigger from GitHub UI
```

| Trigger | When It Fires |
|---|---|
| `push: branches: [main, master]` | Every time you push code to main or master |
| `workflow_dispatch` | When you click "Run workflow" in the GitHub Actions tab |

#### Section 3: Permissions

```yaml
permissions:
  contents: read      # Read the repository code
  pages: write        # Create and update GitHub Pages
  id-token: write     # Generate a token to prove deployment is authorized
```

These are **required** for GitHub Pages deployment. Without them, the deploy job fails.

#### Section 4: Concurrency

```yaml
concurrency:
  group: "pages"              # All deployments share one group
  cancel-in-progress: false   # Don't cancel a running deployment
```

**Scenario:** You push twice in 30 seconds.
- With `cancel-in-progress: false`: First deployment finishes, then second runs.
- With `cancel-in-progress: true`: First deployment is cancelled, only second runs.

#### Section 5: Build Job

```yaml
build:
  runs-on: ubuntu-latest    # GitHub-hosted Ubuntu runner
  steps:
```

| Step | What It Does |
|---|---|
| `actions/checkout@v4` | Downloads your repository code |
| `actions/setup-node@v4` | Installs Node.js 20 and caches npm |
| `npm ci` | Installs dependencies (faster than `npm install`) |
| `npm run build -- --configuration production` | Builds Angular for production |
| `actions/upload-pages-artifact@v3` | Uploads `dist/angular-ngrx/` as a deployment artifact |

**Why `npm ci` instead of `npm install`?**
- `npm ci` deletes `node_modules/` and installs from `package-lock.json` exactly
- Faster, more reliable, deterministic builds
- Used in CI/CD environments

#### Section 6: Deploy Job

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build    # Only runs after build succeeds
  steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

| Field | Purpose |
|---|---|
| `environment: name: github-pages` | Targets the GitHub Pages environment |
| `needs: build` | Won't run unless build job succeeds first |
| `actions/deploy-pages@v4` | Publishes the artifact to GitHub Pages |

---

## Step 3: Enable GitHub Pages

### Via GitHub UI

1. Go to your repository: `https://github.com/sj-84/redux_store_2025`
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Build and deployment** > **Source**, select **GitHub Actions**
5. Save

### What Happens When You Select "GitHub Actions"

GitHub stops looking for a `gh-pages` branch and instead waits for your workflow to publish the site. The page will show:

> "Workflow details will appear here once your site has been deployed."

---

## Step 4: Push and Deploy

### Initial Push

```bash
cd D:\Angular2024\Redux5\angular-ngrx-example

# Stage all changes
git add .

# Commit
git commit -m "Add GitHub Pages deployment"

# Push to main (triggers the workflow)
git push origin main
```

### Verify Deployment

1. Go to `https://github.com/sj-84/redux_store_2025/actions`
2. You should see a workflow run labeled "Deploy to GitHub Pages"
3. Wait for both jobs (build + deploy) to complete (~2 minutes)
4. Once green, visit your site: `https://sj-84.github.io/redux_store_2025/`

### Subsequent Pushes

Every time you push to `main`:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

The workflow automatically rebuilds and redeploys. No manual steps needed.

---

## How the YAML Workflow Works

### Visual Flow

```
git push origin main
         |
         v
GitHub Actions detects push to main branch
         |
         v
Reads .github/workflows/deploy.yml
         |
         v
+-------------------+
|   BUILD JOB       |
| (ubuntu-latest)   |
|                   |
| 1. Checkout code  |
| 2. Setup Node 20  |
| 3. npm ci         |
| 4. ng build       |
| 5. Upload artifact|
+-------------------+
         |
         v
+-------------------+
|   DEPLOY JOB      |
| (ubuntu-latest)   |
|                   |
| 1. Download       |
|    artifact       |
| 2. Publish to     |
|    GitHub Pages   |
+-------------------+
         |
         v
Site live at:
https://sj-84.github.io/redux_store_2025/
```

### What Gets Deployed

```
dist/angular-ngrx/           <-- This folder is published
├── index.html               <-- Contains <base href="/redux_store_2025/">
├── main.abc123.js            <-- Your Angular app (bundled)
├── polyfills.def456.js       <-- Browser polyfills
├── runtime.ghi789.js         <-- Webpack runtime
├── styles.jkl012.css         <-- Your styles
├── 927.xyz345.js             <-- Lazy-loaded dashboard chunk
├── 50.abc678.js              <-- Lazy-loaded dashboard chunk
├── 8.def901.js               <-- Lazy-loaded animations
├── 933.ghi234.js             <-- Lazy-loaded product component
├── favicon.ico               <-- Your favicon
└── assets/                   <-- Your static assets
```

### Build Output Summary

```
Initial chunk files:
  main.656b36f5f6d63858.js      554.75 kB  (124.55 kB transferred)
  styles.88f4a9bc261d8533.css    85.17 kB   (8.04 kB transferred)
  polyfills.cb8a3acf9ca5a6a6.js  34.00 kB  (11.08 kB transferred)
  runtime.8969121819b55a27.js     2.72 kB   (1.30 kB transferred)

Lazy chunk files:
  dashboard-dashboard-routes     216.09 kB  (63.37 kB transferred)
  dashboard-dashboard-routes     159.36 kB  (23.35 kB transferred)
  angular-animations-browser      62.52 kB  (16.47 kB transferred)
  product-product-component       31.96 kB   (8.59 kB transferred)

Total: 676.63 kB (144.97 kB transferred)
```

---

## Troubleshooting

### Issue 1: 404 Error on Site

**Symptom:** `https://sj-84.github.io/redux_store_2025/` shows 404.

**Causes:**
- Workflow hasn't completed yet (wait 2-3 minutes)
- GitHub Pages source not set to "GitHub Actions"
- Base href mismatch

**Fix:**
1. Check workflow status at `https://github.com/sj-84/redux_store_2025/actions`
2. Verify Settings > Pages > Source is "GitHub Actions"
3. Verify `angular.json` has `"baseHref": "/redux_store_2025/"`

### Issue 2: Blank Page / Assets Not Loading

**Symptom:** Page loads but shows blank white screen or console errors about missing files.

**Cause:** Base href is wrong or missing.

**Fix:**
```bash
# Check the built index.html
cat dist/angular-ngrx/index.html | grep base

# Should show:
# <base href="/redux_store_2025/">

# If missing, add to angular.json production config:
# "baseHref": "/redux_store_2025/"
```

### Issue 3: Workflow Fails at npm ci

**Symptom:** Build job fails with npm errors.

**Cause:** `package-lock.json` is missing or out of sync.

**Fix:**
```bash
# Regenerate package-lock.json
rm -rf node_modules
npm install

# Commit the lock file
git add package-lock.json
git commit -m "Update package-lock.json"
git push origin main
```

### Issue 4: Workflow Fails at Build

**Symptom:** Build job fails during `ng build`.

**Cause:** TypeScript errors or missing dependencies.

**Fix:**
```bash
# Test build locally first
ng build --configuration production

# Fix any errors, then push
git add .
git commit -m "Fix build errors"
git push origin main
```

### Issue 5: Deploy Job Fails

**Symptom:** Build succeeds but deploy job fails.

**Cause:** GitHub Pages not enabled or permissions missing.

**Fix:**
1. Go to Settings > Pages > Source > Select "GitHub Actions"
2. Verify the workflow has the correct permissions block:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Issue 6: Old Version Showing

**Symptom:** Site shows old code after pushing new changes.

**Cause:** Browser cache or CDN cache.

**Fix:**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Wait 2-3 minutes for CDN cache to clear
- Check workflow completed successfully

---

## Manual Deployment (Alternative)

If you prefer not to use GitHub Actions, you can deploy manually:

### Option A: Using angular-cli-ghpages

```bash
# Install the tool
npm install -g angular-cli-ghpages

# Build for production
ng build --configuration production --base-href /redux_store_2025/

# Deploy to gh-pages branch
npx angular-cli-ghpages --dir=dist/angular-ngrx
```

### Option B: Using the gh-pages Branch

```bash
# Build for production
ng build --configuration production --base-href /redux_store_2025/

# Install gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d dist/angular-ngrx
```

### Option C: Manual Upload

1. Build: `ng build --configuration production --base-href /redux_store_2025/`
2. Go to Settings > Pages > Source > Select "Deploy from a branch"
3. Select `main` branch and `/docs` folder
4. Copy `dist/angular-ngrx/*` to a `docs/` folder in your repo
5. Commit and push

**Note:** Options B and C use the `gh-pages` branch method. The GitHub Actions method (recommended) is cleaner and doesn't require a separate branch.

---

## Adding the MFE Later

To deploy both the host app and MFE dashboard:

### Step 1: Build Both

```bash
ng build --configuration production
ng build mfe-dashboard --configuration production
```

### Step 2: Update the Workflow

```yaml
- name: Build for GitHub Pages
  run: |
    npm run build -- --configuration production
    ng build mfe-dashboard --configuration production

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: "./dist"
```

This uploads the entire `dist/` folder containing both:
- `dist/angular-ngrx/` — Host app
- `dist/mfe-dashboard/` — MFE remote

### Step 3: Update Routes

The host app's lazy-loaded dashboard routes would need to load from the MFE remote URL instead of local files.

---

## Quick Reference

### Commands

| Command | Description |
|---|---|
| `ng serve` | Start dev server |
| `ng build --configuration production` | Production build |
| `ng build --configuration production --base-href /redux_store_2025/` | Build with base href |
| `git push origin main` | Push and trigger deployment |

### URLs

| URL | Purpose |
|---|---|
| https://github.com/sj-84/redux_store_2025 | Repository |
| https://github.com/sj-84/redux_store_2025/actions | Workflow runs |
| https://github.com/sj-84/redux_store_2025/settings/pages | Pages settings |
| https://sj-84.github.io/redux_store_2025/ | Live site |

### File Locations

| File | Purpose |
|---|---|
| `angular.json` | Contains `baseHref` configuration |
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `dist/angular-ngrx/` | Production build output |
| `dist/angular-ngrx/index.html` | Built HTML with base href |

---

## Summary

| Step | Action | Status |
|---|---|---|
| 1 | Add `baseHref` to `angular.json` | Done |
| 2 | Create `.github/workflows/deploy.yml` | Done |
| 3 | Enable GitHub Pages (Settings > Pages > GitHub Actions) | Done |
| 4 | Push to main | Done |
| 5 | Site live at `https://sj-84.github.io/redux_store_2025/` | Done |

Every subsequent `git push origin main` automatically redeploys the site.
