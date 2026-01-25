# Build System

A modular, type-safe static site generator powered by [Eta](https://eta.js.org/) templates.

## Features

- ✨ **Type-safe configuration** - Full TypeScript support with comprehensive types
- 🔧 **Modular architecture** - Separated concerns for config, data, and templates
- 🎨 **Component-based templates** - Header, content, footer with partials and layouts
- 📊 **Hierarchical data loading** - Global data + page-specific data
- 🔄 **Smart file watching** - Automatic rebuilds on changes to data or templates
- 🌐 **Built-in dev server** - Live development with automatic port detection
- 🚀 **Fast builds** - Efficient caching and minimal overhead

## Quick Start

### Build the site

```bash
deno task build
```

This generates static HTML files in the `dist/` directory.

### Development mode with live reload

```bash
deno task dev
```

This:
1. Builds the site
2. Starts a dev server at `http://localhost:3000`
3. Watches for changes to `data/` and `src/views/`
4. Automatically rebuilds on changes

### Custom port

```bash
deno task dev:port=8080
```

Or pass the port as an argument:

```bash
deno run --allow-read --allow-write --allow-net build-system/build.ts --dev --port=8080
```

If the port is already in use, the system will automatically find the next available port.

## Project Structure

```
├── build-system/        # Build system core
│   ├── config.ts        # Type-safe Eta configuration
│   ├── types.ts         # Template and data type definitions
│   ├── data-loader.ts   # Data loading and merging logic
│   ├── build.ts         # Main build orchestrator
│   └── mod.ts           # Public API exports
├── data/                # Page and component data
│   ├── global.ts        # Global data (available to all pages)
│   ├── index.ts         # Index page data
│   └── components/      # Component-level defaults
│       ├── header.ts
│       └── footer.ts
├── src/views/           # Eta templates
│   ├── layouts/         # Page layouts
│   │   └── base.eta
│   ├── partials/        # Reusable components
│   │   ├── header.eta
│   │   └── footer.eta
│   └── pages/           # Page content templates
│       └── index.eta
└── dist/                # Generated output (git-ignored)
```

## Creating a New Page

### 1. Create the data file

Create `data/mypage.ts`:

```typescript
import { createPageTemplate, type ContentData } from "../build-system/types.ts";

interface MyPageContent extends ContentData {
  heading: string;
  body: string;
}

const myPage = createPageTemplate<MyPageContent>({
  id: "mypage",
  title: "My New Page",
  output: "mypage.html",
  
  content: {
    heading: "Welcome to My Page",
    body: "This is my page content.",
  },
  
  meta: {
    description: "Description for SEO",
    keywords: ["keyword1", "keyword2"],
  },
});

export default myPage;
```

### 2. Create the template

Create `src/views/pages/mypage.eta`:

```html
<section class="mypage">
  <div class="container">
    <h1><%= it.content.heading %></h1>
    <p><%= it.content.body %></p>
  </div>
</section>
```

### 3. Build

Run `deno task build` and your page will be generated as `dist/mypage.html`.

## Template Context

All templates have access to the `it` object with the following structure:

```typescript
{
  global: {
    siteTitle: string,
    author: string,
    navigation: NavigationItem[],
    social: SocialLinks,
    // ... more global data
  },
  page: {
    id: string,
    title: string,
    output: string,
    // ... page metadata
  },
  header: {
    showNav: boolean,
    cssClasses: string[],
    // ... header config
  },
  content: {
    // Your page-specific content
  },
  footer: {
    showSocial: boolean,
    showCopyright: boolean,
    // ... footer config
  },
  meta: {
    description: string,
    keywords: string[],
    // ... SEO metadata
  }
}
```

## Using Partials

Include a partial in your template:

```eta
<%~ include("../partials/header", it) %>
```

## Using Layouts

Layouts wrap your page content. Specify a layout in your page data:

```typescript
const page = createPageTemplate({
  id: "mypage",
  layout: "base",  // uses layouts/base.eta
  // ...
});
```

## Configuration

Customize the build system by modifying `build-system/config.ts`. All [Eta configuration options](https://eta.js.org/docs/4.x.x/api/configuration) are supported:

- `autoEscape` - Auto-escape HTML (default: true)
- `cache` - Cache compiled templates (default: true)
- `debug` - Pretty error messages (default: true)
- `tags` - Change delimiters (default: `['<%', '%>']`)
- And many more...

## Programmatic Usage

Import the build system in your own scripts:

```typescript
import { build, watch, createPageTemplate } from "./build-system/mod.ts";

// Build once
await build();

// Start dev mode with custom config
await watch({ 
  eta: { cache: false, debug: true } 
}, 8080);
```

## Dev Server Features

- 🔍 Automatic MIME type detection
- 🚫 No-cache headers for development
- 🔄 Works with file watching for instant updates
- 📂 Serves files from `dist/` directory
- 🎯 404 error handling

## Tips

1. **Global data**: Add site-wide data to `data/global.ts` (social links, navigation, etc.)
2. **Type safety**: Extend `ContentData` interface for page-specific content types
3. **Component defaults**: Use `data/components/` for default component configurations
4. **Watch mode**: Use `deno task dev` during development for instant feedback
5. **Port conflicts**: The dev server automatically finds an available port

## License

MIT
