/**
 * Index Page Data Module
 * 
 * Page-specific data for the home/index page.
 * This is merged with global data to form the complete page context.
 */

import { createPageTemplate, type IndexContentData } from "../build-system/types.ts";

const indexPage = createPageTemplate<IndexContentData>({
  id: "index",
  title: "Kunal Singh - Senior Software Engineer",
  output: "index.html",
  layout: "base",
  
  header: {
    showNav: true,
    cssClasses: ["header--home"],
  },
  
  content: {
    hero: {
      name: "Kunal Singh",
      tagline: "Senior Software Engineer",
      description: "Building elegant solutions to complex problems. Passionate about clean code, system design, and developer experience.",
    },
    cta: {
      primary: {
        label: "View Projects",
        href: "/projects",
      },
      secondary: {
        label: "Get in Touch",
        href: "mailto:hi@kunal-singh.com",
      },
    },
  },
  
  footer: {
    showSocial: true,
    showCopyright: true,
  },
  
  meta: {
    description: "Kunal Singh - Senior Software Engineer specializing in building elegant solutions to complex problems.",
    keywords: ["software engineer", "developer", "web development", "full stack"],
  },
});

export default indexPage;
