/**
 * Main Build Script
 * 
 * Orchestrates the entire build process:
 * 1. Loads configuration
 * 2. Initializes Eta with full configuration
 * 3. Loads global and page-specific data
 * 4. Renders templates with merged context
 * 5. Outputs to the dist directory
 */

import { Eta } from "@bgub/eta";
import { config, mergeConfig, validateConfig, type BuildConfig } from "./config.ts";
import { loadGlobalData, loadAllPages, buildTemplateContext, clearDataCache } from "./data-loader.ts";
import type { PageTemplate, TemplateContext } from "./types.ts";

/**
 * Initialize Eta with the full configuration
 */
const initializeEta = (buildConfig: BuildConfig): Eta => {
  const etaConfig = buildConfig.eta;
  
  return new Eta({
    views: etaConfig.views,
    defaultExtension: etaConfig.defaultExtension,
    autoEscape: etaConfig.autoEscape,
    autoTrim: etaConfig.autoTrim,
    cache: etaConfig.cache,
    debug: etaConfig.debug,
    rmWhitespace: etaConfig.rmWhitespace,
    tags: etaConfig.tags,
    useWith: etaConfig.useWith,
    varName: etaConfig.varName,
    functionHeader: etaConfig.functionHeader,
  });
};

/**
 * Ensure output directory exists
 */
const ensureOutputDir = async (outputDir: string): Promise<void> => {
  await Deno.mkdir(outputDir, { recursive: true });
};

/**
 * Render a single page
 */
const renderPage = (
  eta: Eta,
  buildConfig: BuildConfig,
  page: PageTemplate,
  context: TemplateContext
): string => {
  // Determine which layout/template to use
  const layout = page.layout || "base";
  const templatePath = `${buildConfig.layoutsDir}/${layout}`;
  
  try {
    // Render the page using the layout
    const html = eta.render(templatePath, context);
    return html;
  } catch (error) {
    console.error(`Error rendering page ${page.id}:`, error);
    throw error;
  }
};

/**
 * Write rendered HTML to file
 */
const writePage = async (
  outputDir: string,
  filename: string,
  content: string
): Promise<void> => {
  const outputPath = `${outputDir}${filename}`;
  await Deno.writeTextFile(outputPath, content);
  console.log(`✓ Generated ${outputPath}`);
};

/**
 * Build statistics
 */
interface BuildStats {
  pagesBuilt: number;
  startTime: number;
  endTime: number;
}

/**
 * Main build function
 */
export const build = async (
  customConfig?: Partial<BuildConfig>
): Promise<BuildStats> => {
  const startTime = performance.now();
  
  console.log("🚀 Starting build...\n");
  
  // Merge custom config with defaults
  const buildConfig = customConfig ? mergeConfig(customConfig) : config;
  
  // Validate configuration
  validateConfig(buildConfig);
  
  // Clear cache for fresh builds
  clearDataCache();
  
  // Initialize Eta
  const eta = initializeEta(buildConfig);
  console.log(`📦 Eta initialized with views: ${buildConfig.eta.views}`);
  
  // Ensure output directory exists
  await ensureOutputDir(buildConfig.outputDir);
  console.log(`📁 Output directory: ${buildConfig.outputDir}`);
  
  // Load global data
  const globalData = await loadGlobalData(buildConfig);
  console.log(`📊 Global data loaded`);
  
  // Load all pages
  const pages = await loadAllPages(buildConfig);
  console.log(`📄 Found ${pages.length} page(s) to build\n`);
  
  // Render each page
  let pagesBuilt = 0;
  
  for (const page of pages) {
    console.log(`Building: ${page.id}`);
    
    // Build the complete context for this page
    const context = await buildTemplateContext(buildConfig, page, globalData);
    
    // Render the page
    const html = await renderPage(eta, buildConfig, page, context);
    
    // Write to output
    await writePage(buildConfig.outputDir, page.output, html);
    
    pagesBuilt++;
  }
  
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  
  console.log(`\n✨ Build complete! ${pagesBuilt} page(s) built in ${duration}ms`);
  
  return {
    pagesBuilt,
    startTime,
    endTime,
  };
};

/**
 * Check if a port is available
 */
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const listener = Deno.listen({ port });
      listener.close();
      resolve(true);
    } catch {
      resolve(false);
    }
  });
};

/**
 * Find an available port starting from the given port
 */
const findAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is in use, trying ${port + 1}...`);
    port++;
  }
  return port;
};

/**
 * Start the development server
 */
const startDevServer = async (
  buildConfig: BuildConfig,
  port: number
): Promise<void> => {
  const availablePort = await findAvailablePort(port);
  
  console.log(`\n🌐 Dev server starting on http://localhost:${availablePort}`);
  console.log(`📂 Serving files from: ${buildConfig.outputDir}\n`);
  
  const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    
    try {
      const file = await Deno.readFile(`${buildConfig.outputDir}${path}`);
      const ext = path.split(".").pop();
      const types: Record<string, string> = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        ico: "image/x-icon",
        woff: "font/woff",
        woff2: "font/woff2",
        ttf: "font/ttf",
      };
      
      return new Response(file, {
        headers: { 
          "Content-Type": types[ext || "html"] || "text/plain",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch (_error) {
      console.error(`404 - Not Found: ${path}`);
      return new Response("Not Found", { status: 404 });
    }
  };
  
  Deno.serve({ port: availablePort }, handler);
};

/**
 * Watch mode for development with dev server
 */
export const watch = async (
  customConfig?: Partial<BuildConfig>,
  port: number = 3000
): Promise<void> => {
  const buildConfig = customConfig ? mergeConfig(customConfig) : config;
  
  console.log("👀 Starting development mode...\n");
  
  // Initial build
  await build(customConfig);
  
  // Start dev server in the background
  startDevServer(buildConfig, port);
  
  // Watch data directory
  const dataWatcher = Deno.watchFs(buildConfig.dataDir);
  const viewsWatcher = Deno.watchFs(buildConfig.viewsDir);
  
  const handleChange = async (event: Deno.FsEvent) => {
    if (event.kind === "modify" || event.kind === "create") {
      console.log(`\n🔄 Change detected: ${event.paths.join(", ")}`);
      clearDataCache();
      await build(customConfig);
      console.log("👀 Watching for changes...\n");
    }
  };
  
  // Watch both directories
  (async () => {
    for await (const event of dataWatcher) {
      await handleChange(event);
    }
  })();
  
  for await (const event of viewsWatcher) {
    await handleChange(event);
  }
};

/**
 * Parse CLI arguments
 */
const parseArgs = (): { mode: "build" | "dev"; port: number } => {
  const args = Deno.args;
  const mode = args.includes("--dev") || args.includes("dev") ? "dev" : "build";
  
  // Look for --port=XXXX or --port XXXX
  let port = 3000;
  const portFlagIndex = args.findIndex((arg) => arg.startsWith("--port"));
  
  if (portFlagIndex !== -1) {
    const portArg = args[portFlagIndex];
    if (portArg.includes("=")) {
      port = parseInt(portArg.split("=")[1], 10);
    } else if (args[portFlagIndex + 1]) {
      port = parseInt(args[portFlagIndex + 1], 10);
    }
  }
  
  if (isNaN(port) || port < 1 || port > 65535) {
    console.warn(`Invalid port number, using default: 3000`);
    port = 3000;
  }
  
  return { mode, port };
};

// Run build when executed directly
if (import.meta.main) {
  const { mode, port } = parseArgs();
  
  if (mode === "dev") {
    await watch(undefined, port);
  } else {
    await build();
  }
}
