/**
 * Build Script
 * 
 * Uses the @kunal-singh/cometa package for static site generation.
 */

import { build, watch } from "@kunal-singh/cometa";
import globalData from "./data/global.ts";
import indexPage from "./data/index.ts";

/**
 * Build configuration
 */
const config = {
  globalData,
  pages: [indexPage],
  viewsDir: `${Deno.cwd()}/src/views/`,
  outputDir: `${Deno.cwd()}/dist/`,
  layoutsDir: "layouts",
  partialsDir: "partials",
  pagesDir: "pages",
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

// Run build or dev mode
if (import.meta.main) {
  const { mode, port } = parseArgs();
  
  if (mode === "dev") {
    await watch({ ...config, port });
  } else {
    await build(config);
  }
}
