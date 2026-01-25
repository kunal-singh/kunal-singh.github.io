/**
 * Build System Module Exports
 * 
 * Re-exports all public APIs for the build system.
 */

// Configuration exports
export {
  type EtaConfig,
  type EtaParseConfig,
  type EtaPlugin,
  type TrimConfig,
  type BuildConfig,
  config,
  createDefaultConfig,
  mergeConfig,
  validateConfig,
} from "./config.ts";

// Type exports
export {
  type GlobalData,
  type NavigationItem,
  type SocialLinks,
  type HeaderData,
  type FooterData,
  type ContentData,
  type PageTemplate,
  type MetaData,
  type TemplateRegistry,
  type DataModule,
  type TemplateContext,
  type IndexContentData,
  type AboutContentData,
  isGlobalData,
  isPageTemplate,
  createPageTemplate,
} from "./types.ts";

// Data loader exports
export {
  loadDataModule,
  loadGlobalData,
  loadPageData,
  loadComponentData,
  loadAllPages,
  buildTemplateContext,
  clearDataCache,
} from "./data-loader.ts";

// Build exports
export { build, watch } from "./build.ts";
