// [ZONE.JS INITIALIZATION]: Zone.js is required by Angular to track asynchronous activities
// (like timers or HTTP requests) and know when rendering is finished on the server side.
import 'zone.js/node';

// [ANGULAR COMPATIBILITY]: APP_BASE_HREF is a injection token used to set the prefix for route paths.
import { APP_BASE_HREF } from '@angular/common';

// [SSR ENGINE]: CommonEngine is the core class from Angular SSR that handles running the app
// in memory on the server and converting the components into static HTML.
import { CommonEngine } from '@angular/ssr';

// [EXPRESS FRAMEWORK]: Imports the Express Node.js web server library to listen for network requests.
import * as express from 'express';

// [FILE SYSTEM API]: Imports existsSync from Node's fs module to check if files exist on disk.
import { existsSync } from 'node:fs';

// [PATH UTILITY]: Imports join from Node's path module to combine paths in a cross-platform safe way.
import { join } from 'node:path';

// [ANGULAR BOOTSTRAP]: Imports the main server-side entry point of our Angular application.
import bootstrap from './src/main.server';

// [EXPRESS CREATION FUNCTION]: Defines and exports a function that builds and returns the Express server instance.
// This allows the server to be run locally or deployed to serverless environments (like Firebase/GCP Cloud Functions).
export function app(): express.Express {
  // 1. Initialize a new Express server instance.
  const server = express();

  // 2. Compute the absolute path to the client-side 'browser' folder (where compiled html, js, css, and images live).
  const distFolder = join(process.cwd(), 'dist/angular-ngrx/browser');

  // 3. Find the primary index.html template file. Angular CLI sometimes names the original template 'index.original.html'.
  // We check which one exists so the server knows which baseline file to load.
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  // 4. Create an instance of the Angular SSR CommonEngine.
  const commonEngine = new CommonEngine();

  // 5. Configure Express to recognize HTML files as views (used for rendering pages).
  server.set('view engine', 'html');

  // 6. Set the default directory where Express looks for templates/views to be our client 'browser' folder.
  server.set('views', distFolder);

  // [STATIC ASSET MIDDLEWARE]: Intercepts requests for static files containing a dot (e.g. main.js, styles.css, favicon.ico).
  // express.static serves these directly from disk with a caching header of 1 year, bypassing the Angular compiler.
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // [SSR ROUTE HANDLER]: Intercepts all page route requests (e.g. /products, /ssr-overview, or fallback wildcard routes).
  server.get('*', (req, res, next) => {
    // Extract routing and request headers (needed to build full absolute URLs for Angular's router)
    const { protocol, originalUrl, baseUrl, headers } = req;

    // Use CommonEngine to compile the Angular component tree into HTML text
    commonEngine
      .render({
        // Pass the server-side Angular bootstrapper function
        bootstrap,
        // Pass the path to the template index.html file
        documentFilePath: indexHtml,
        // Build the absolute URL (e.g., http://localhost:4000/ssr-overview) so Angular router knows which page to render
        url: `${protocol}://${headers.host}${originalUrl}`,
        // Pass the browser build directory
        publicPath: distFolder,
        // Pass context providers: sets APP_BASE_HREF dynamically matching Express's baseUrl prefix
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      // If rendering succeeds, send the generated HTML markup back to the user's browser
      .then((html) => res.send(html))
      // If rendering fails, forward the error to the Express next() middleware to display a stack trace/500 error
      .catch((err) => next(err));
  });

  // Return the configured Express server instance
  return server;
}

// [SERVER INITIATION]: Starts the Node server locally
function run(): void {
  // Look for a PORT environment variable (e.g. set by hosting environment) or default to 4000
  const port = process.env['PORT'] || 4000;

  // Build the server instance
  const server = app();

  // Start the server to listen on the selected port
  server.listen(port, () => {
    // Print confirmation console log when server goes online
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// [WEBPACK ENTRY GUARD]: Webpack compiler will replace global 'require' with '__webpack_require__' in production builds.
// '__non_webpack_require__' acts as a bypass to access Node's native 'require'.
declare const __non_webpack_require__: NodeRequire;
// Get the node module that executed this process
const mainModule = __non_webpack_require__.main;
// Check the filename of the executed module
const moduleFilename = mainModule && mainModule.filename || '';
// Start the server if this file is executed directly (via node server.js) or run inside iisnode
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

// Export the bootstrap function as default module
export default bootstrap;
