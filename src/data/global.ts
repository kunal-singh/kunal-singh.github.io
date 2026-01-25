/**
 * Global Data Module
 * 
 * This data is available to all pages and templates.
 * It's loaded once and merged with page-specific data.
 */

import type { GlobalData } from "jsr:@kunal-singh/cometa";

const globalData: GlobalData = {
  siteTitle: "Kunal Singh",
  siteDescription: "Senior Software Engineer - Building elegant solutions to complex problems",
  author: "Kunal Singh",
  baseUrl: "https://kunal-singh.com",
  year: new Date().getFullYear(),
  
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  
  social: {
    github: "kunal-singh",
    linkedin: "kunal-singh",
    email: "hi@kunal-singh.com",
  },
};

export default globalData;
