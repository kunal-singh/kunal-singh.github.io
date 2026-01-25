/**
 * Default Header Component Data
 * 
 * These are the default settings for the header component.
 * Individual pages can override these values.
 */

import type { HeaderData } from "jsr:@kunal-singh/cometa";

const headerDefaults: Partial<HeaderData> = {
  showNav: true,
  cssClasses: [],
};

export default headerDefaults;
