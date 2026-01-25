/**
 * Type Definitions for Template System
 * 
 * Defines the strict type hierarchy for the template system
 * including header, content, and footer components.
 */

/**
 * Base data that all components can access
 */
export interface GlobalData {
  /** Site title */
  siteTitle: string;
  /** Site description */
  siteDescription: string;
  /** Author name */
  author: string;
  /** Base URL of the site */
  baseUrl: string;
  /** Current year for copyright */
  year: number;
  /** Navigation items */
  navigation: NavigationItem[];
  /** Social links */
  social: SocialLinks;
}

/**
 * Navigation item structure
 */
export interface NavigationItem {
  /** Display label */
  label: string;
  /** URL path */
  href: string;
  /** Whether this is the active page */
  active?: boolean;
}

/**
 * Social media links
 */
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

/**
 * Header component data
 */
export interface HeaderData {
  /** Page-specific title */
  title?: string;
  /** Whether to show navigation */
  showNav?: boolean;
  /** Additional CSS classes */
  cssClasses?: string[];
}

/**
 * Footer component data
 */
export interface FooterData {
  /** Show social links */
  showSocial?: boolean;
  /** Show copyright */
  showCopyright?: boolean;
  /** Additional footer text */
  additionalText?: string;
}

/**
 * Content component data - generic for flexibility
 */
export interface ContentData {
  [key: string]: unknown;
}

/**
 * Complete page template structure
 */
export interface PageTemplate<T extends ContentData = ContentData> {
  /** Unique page identifier */
  id: string;
  /** Page title (used in <title> tag) */
  title: string;
  /** Output filename */
  output: string;
  /** Layout to use (default: 'base') */
  layout?: string;
  /** Header component configuration */
  header?: HeaderData;
  /** Content component data - page specific */
  content: T;
  /** Footer component configuration */
  footer?: FooterData;
  /** Meta tags for SEO */
  meta?: MetaData;
}

/**
 * Meta data for SEO
 */
export interface MetaData {
  /** Meta description */
  description?: string;
  /** Meta keywords */
  keywords?: string[];
  /** Open Graph image */
  ogImage?: string;
  /** Canonical URL */
  canonical?: string;
}

/**
 * Template registry for managing all pages
 */
export interface TemplateRegistry {
  /** All registered pages */
  pages: PageTemplate[];
}

/**
 * Data module interface for dynamic imports
 */
export interface DataModule<T = unknown> {
  /** Default export should be the data */
  default: T;
}

/**
 * Combined template data passed to Eta
 * This is what's available as 'it' in templates
 */
export interface TemplateContext<T extends ContentData = ContentData> {
  /** Global data */
  global: GlobalData;
  /** Page-specific data */
  page: PageTemplate<T>;
  /** Header data (merged from global defaults and page overrides) */
  header: HeaderData;
  /** Content data */
  content: T;
  /** Footer data (merged from global defaults and page overrides) */
  footer: FooterData;
  /** Meta data */
  meta: MetaData;
}

/**
 * Type guard to check if data is a valid GlobalData
 */
export const isGlobalData = (data: unknown): data is GlobalData => {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.siteTitle === "string" &&
    typeof d.author === "string" &&
    typeof d.baseUrl === "string"
  );
};

/**
 * Type guard for PageTemplate
 */
export const isPageTemplate = (data: unknown): data is PageTemplate => {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.title === "string" &&
    typeof d.output === "string"
  );
};

/**
 * Helper to create a page template with defaults
 */
export const createPageTemplate = <T extends ContentData>(
  page: Omit<PageTemplate<T>, "header" | "footer" | "meta"> & {
    header?: Partial<HeaderData>;
    footer?: Partial<FooterData>;
    meta?: Partial<MetaData>;
  }
): PageTemplate<T> => {
  return {
    layout: "base",
    header: {
      showNav: true,
      cssClasses: [],
      ...page.header,
    },
    footer: {
      showSocial: true,
      showCopyright: true,
      ...page.footer,
    },
    meta: {
      keywords: [],
      ...page.meta,
    },
    ...page,
  } as PageTemplate<T>;
};

/**
 * Index page specific content data
 */
export interface IndexContentData extends ContentData {
  /** Hero section data */
  hero: {
    name: string;
    tagline: string;
    description?: string;
  };
  /** Call to action buttons */
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

/**
 * About page specific content data
 */
export interface AboutContentData extends ContentData {
  /** Bio content (can be HTML) */
  bio: string;
  /** Skills list */
  skills?: string[];
  /** Experience items */
  experience?: {
    company: string;
    role: string;
    period: string;
    description?: string;
  }[];
}
