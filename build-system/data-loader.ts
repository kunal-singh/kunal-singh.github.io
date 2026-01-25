/**
 * Data Loader Module
 * 
 * Handles loading and merging of data from TypeScript modules
 * including global data and per-template/component data.
 */

import type {
  GlobalData,
  PageTemplate,
  TemplateContext,
  ContentData,
  HeaderData,
  FooterData,
  MetaData,
  DataModule,
} from "./types.ts";
import type { BuildConfig } from "./config.ts";

/**
 * Cache for loaded data modules
 */
const dataCache = new Map<string, unknown>();

/**
 * Load a TypeScript module from the data directory
 */
export const loadDataModule = async <T>(
  dataDir: string,
  moduleName: string
): Promise<T | null> => {
  const cacheKey = `${dataDir}/${moduleName}`;
  
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as T;
  }

  const modulePath = `${dataDir}${moduleName}.ts`;
  
  try {
    // Check if file exists
    await Deno.stat(modulePath);
    
    // Dynamic import of the data module
    const module: DataModule<T> = await import(`file://${modulePath}`);
    const data = module.default;
    
    dataCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.warn(`Data module not found: ${modulePath}`);
      return null;
    }
    throw error;
  }
};

/**
 * Load the global data from global.ts
 */
export const loadGlobalData = async (
  config: BuildConfig
): Promise<GlobalData> => {
  const globalData = await loadDataModule<GlobalData>(
    config.dataDir,
    "global"
  );

  if (!globalData) {
    throw new Error(
      `Global data file not found at ${config.dataDir}global.ts`
    );
  }

  return globalData;
};

/**
 * Load page-specific data from the data directory
 * The file should match the page id (e.g., index.ts for page id "index")
 */
export const loadPageData = async <T extends ContentData>(
  config: BuildConfig,
  pageId: string
): Promise<PageTemplate<T> | null> => {
  return await loadDataModule<PageTemplate<T>>(config.dataDir, pageId);
};

/**
 * Load component-specific data overrides
 * For example, header.ts would provide default header configuration
 */
export const loadComponentData = async <T>(
  config: BuildConfig,
  componentName: string
): Promise<T | null> => {
  return await loadDataModule<T>(config.dataDir, `components/${componentName}`);
};

/**
 * Merge header data with defaults and page overrides
 */
const mergeHeaderData = (
  globalDefaults: Partial<HeaderData>,
  pageOverrides?: HeaderData
): HeaderData => {
  const mergedCssClasses = [
    ...(globalDefaults.cssClasses || []),
    ...(pageOverrides?.cssClasses || []),
  ];

  return {
    showNav: true,
    ...globalDefaults,
    ...pageOverrides,
    cssClasses: mergedCssClasses,
  };
};

/**
 * Merge footer data with defaults and page overrides
 */
const mergeFooterData = (
  globalDefaults: Partial<FooterData>,
  pageOverrides?: FooterData
): FooterData => {
  return {
    showSocial: true,
    showCopyright: true,
    ...globalDefaults,
    ...pageOverrides,
  };
};

/**
 * Merge meta data with defaults and page overrides
 */
const mergeMetaData = (
  globalData: GlobalData,
  _page: PageTemplate,
  pageOverrides?: MetaData
): MetaData => {
  return {
    description: globalData.siteDescription,
    keywords: [],
    ...pageOverrides,
  };
};

/**
 * Build the complete template context for a page
 * Merges global data, page data, and component data
 */
export const buildTemplateContext = async <T extends ContentData>(
  config: BuildConfig,
  page: PageTemplate<T>,
  globalData: GlobalData
): Promise<TemplateContext<T>> => {
  // Load optional component-level defaults
  const headerDefaults = await loadComponentData<Partial<HeaderData>>(
    config,
    "header"
  );
  const footerDefaults = await loadComponentData<Partial<FooterData>>(
    config,
    "footer"
  );

  // Merge all data into the final context
  const context: TemplateContext<T> = {
    global: globalData,
    page: page,
    header: mergeHeaderData(headerDefaults || {}, page.header),
    content: page.content,
    footer: mergeFooterData(footerDefaults || {}, page.footer),
    meta: mergeMetaData(globalData, page, page.meta),
  };

  return context;
};

/**
 * Load all pages from the data directory
 * Scans for TypeScript files and loads them as page templates
 */
export const loadAllPages = async (
  config: BuildConfig
): Promise<PageTemplate[]> => {
  const pages: PageTemplate[] = [];
  
  try {
    for await (const entry of Deno.readDir(config.dataDir)) {
      // Skip directories and non-TypeScript files
      if (entry.isDirectory) continue;
      if (!entry.name.endsWith(".ts")) continue;
      
      // Skip global.ts and components directory entries
      if (entry.name === "global.ts") continue;
      
      const pageName = entry.name.replace(".ts", "");
      const pageData = await loadPageData(config, pageName);
      
      if (pageData) {
        pages.push(pageData);
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Data directory not found: ${config.dataDir}`);
    }
    throw error;
  }

  return pages;
};

/**
 * Clear the data cache (useful for watch mode)
 */
export const clearDataCache = (): void => {
  dataCache.clear();
};
