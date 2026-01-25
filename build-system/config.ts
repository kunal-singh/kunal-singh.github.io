/**
 * Eta Configuration Module
 * 
 * Type-safe configuration for the Eta templating engine.
 * Reference: https://eta.js.org/docs/4.x.x/api/configuration
 */

/**
 * Trim configuration for whitespace handling
 */
export type TrimConfig = false | "nl" | "slurp";

/**
 * Plugin interface for Eta
 */
export interface EtaPlugin {
  processFnString?: (fnString: string) => string;
  processAST?: (ast: unknown[]) => unknown[];
  processTemplate?: (template: string) => string;
}

/**
 * Parse configuration for Eta delimiters
 */
export interface EtaParseConfig {
  /** Which prefix to use for evaluation. Default "", does not support "-" or "_" */
  exec: string;
  /** Which prefix to use for interpolation. Default "=", does not support "-" or "_" */
  interpolate: string;
  /** Which prefix to use for raw interpolation. Default "~", does not support "-" or "_" */
  raw: string;
}

/**
 * Complete Eta configuration interface
 * All properties match the official Eta configuration API
 */
export interface EtaConfig {
  /** Whether or not to automatically XML-escape interpolations. Default true */
  autoEscape: boolean;

  /** Apply a filter function defined on the class to every interpolation or raw interpolation */
  autoFilter: boolean;

  /** Configure automatic whitespace trimming. Default [false, 'nl'] */
  autoTrim: TrimConfig | [TrimConfig, TrimConfig];

  /** Whether or not to cache templates if name or filename is passed */
  cache: boolean;

  /** Holds cache of resolved filepaths. Set to false to disable. */
  cacheFilepaths: boolean;

  /** Whether to pretty-format error messages (introduces runtime penalties) */
  debug: boolean;

  /** Function to XML-sanitize interpolations */
  escapeFunction: (str: unknown) => string;

  /** Function applied to all interpolations when autoFilter is true */
  filterFunction: (val: unknown) => string;

  /** Raw JS code inserted in the template function. Useful for declaring global variables */
  functionHeader: string;

  /** Parsing options */
  parse: EtaParseConfig;

  /** Array of plugins */
  plugins: EtaPlugin[];

  /** Remove empty lines and whitespace between lines */
  rmWhitespace: boolean;

  /** Delimiters: by default ['<%', '%>'] */
  tags: [string, string];

  /** Make data available on the global object instead of varName */
  useWith: boolean;

  /** Name of the data object. Default 'it' */
  varName: string;

  /** Directory that contains templates */
  views: string;

  /** Control template file extension defaults. Default '.eta' */
  defaultExtension: string;
}

/**
 * Build system configuration interface
 */
export interface BuildConfig {
  /** Eta template engine configuration */
  eta: EtaConfig;

  /** Directory containing data modules */
  dataDir: string;

  /** Output directory for generated files */
  outputDir: string;

  /** Views/templates directory */
  viewsDir: string;

  /** Layouts directory (relative to viewsDir) */
  layoutsDir: string;

  /** Partials directory (relative to viewsDir) */
  partialsDir: string;

  /** Pages directory (relative to viewsDir) */
  pagesDir: string;
}

/**
 * Default HTML escape function
 */
const defaultEscapeFunction = (str: unknown): string => {
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/**
 * Default filter function (identity)
 */
const defaultFilterFunction = (val: unknown): string => String(val);

/**
 * Get the project root directory
 */
const getProjectRoot = (): string => {
  // Navigate up from build-system to project root
  const url = new URL(".", import.meta.url);
  return url.pathname.replace(/\/build-system\/?$/, "");
};

/**
 * Creates the default build configuration
 */
export const createDefaultConfig = (): BuildConfig => {
  const projectRoot = getProjectRoot();
  
  return {
    eta: {
      autoEscape: true,
      autoFilter: false,
      autoTrim: [false, "nl"],
      cache: true,
      cacheFilepaths: true,
      debug: true,
      escapeFunction: defaultEscapeFunction,
      filterFunction: defaultFilterFunction,
      functionHeader: "",
      parse: {
        exec: "",
        interpolate: "=",
        raw: "~",
      },
      plugins: [],
      rmWhitespace: false,
      tags: ["<%", "%>"],
      useWith: false,
      varName: "it",
      views: `${projectRoot}/src/views/`,
      defaultExtension: ".eta",
    },
    dataDir: `${projectRoot}/data/`,
    outputDir: `${projectRoot}/dist/`,
    viewsDir: `${projectRoot}/src/views/`,
    layoutsDir: "layouts",
    partialsDir: "partials",
    pagesDir: "pages",
  };
};

/**
 * Merge partial configuration with defaults
 */
export const mergeConfig = (
  partial: Partial<BuildConfig>
): BuildConfig => {
  const defaults = createDefaultConfig();
  
  return {
    ...defaults,
    ...partial,
    eta: {
      ...defaults.eta,
      ...(partial.eta || {}),
      parse: {
        ...defaults.eta.parse,
        ...(partial.eta?.parse || {}),
      },
    },
  };
};

/**
 * Validate configuration
 */
export const validateConfig = (config: BuildConfig): void => {
  if (!config.eta.views) {
    throw new Error("Configuration error: eta.views is required");
  }
  if (!config.dataDir) {
    throw new Error("Configuration error: dataDir is required");
  }
  if (!config.outputDir) {
    throw new Error("Configuration error: outputDir is required");
  }
};

/**
 * Export the default configuration instance
 */
export const config: BuildConfig = createDefaultConfig();
