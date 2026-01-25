/**
 * Default Footer Component Data
 * 
 * These are the default settings for the footer component.
 * Individual pages can override these values.
 */

import type { FooterData } from "jsr:@kunal-singh/cometa";

const footerDefaults: Partial<FooterData> = {
  showSocial: true,
  showCopyright: true,
};

export default footerDefaults;
