---
name: site-audit
description: Audit the built site for search and performance problems. Reports per route the title, description, canonical, Open Graph and JSON-LD tags, lang, heading outline, link and image accessibility, and the gzip weight of the JS, CSS and fonts the page loads. Use when working on SEO, metadata, sitemap or robots, on performance or bundle size, and before merging changes that touch the layout, metadata or dependencies.
---

# Site audit

Reads the prerendered HTML of the production build and reports what search engines and browsers actually receive.

## Steps

1. Build the site if `.next` is missing or older than the sources: `npx next build`.

2. Run the audit from the repository root:

   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/audit.mjs" --lang pl
   ```

   - `--lang pl` reports a finding when `<html lang>` is not Polish, the language of the site copy.
   - `--js-budget 200` sets the gzip kB of JavaScript per route above which a finding is reported.
   - `--dir <path>` audits a build in another directory, for a before/after comparison.
   - `--json` prints the full result for further processing.

3. Read the report in this order:
   - **Weight per route**: JS, CSS and preloaded fonts in gzip kB.
   - **Site-wide findings**: missing `robots.txt` or `sitemap.xml`, titles or descriptions shared by several routes.
   - **Findings on every route**: template problems. Fix them once, in `src/app/layout.tsx` or in the shared page template.
   - **Per route**: the title, description and heading outline as rendered, with findings specific to that page.

4. When the task was to improve something, run the audit before and after, and report both numbers.

## What the script cannot see

Check these another way before making a claim about them:

- **Core Web Vitals (LCP, CLS, INP)** need a real browser. Use a performance trace from the `chrome-devtools-mcp` plugin if it is installed, or `npx lighthouse <url> --only-categories=performance,seo,accessibility`. Never quote a Lighthouse score that was not measured.
- **JavaScript loaded after the first render** (dynamic imports) is not in the HTML and is not counted.
- **`sitemap.xml` and `robots.txt` contents**: the script only checks that a source for them exists. Fetch both from a running build and read them.
- **Absolute URLs** in `canonical`, `og:url` and the sitemap must use the production domain. Confirm the current domain in Vercel before writing it into code, and keep it in one constant.
- **Structured data validity**: the script lists JSON-LD types but does not validate them against schema.org.

## Where fixes go

Next.js 16 conventions change between versions; read the current docs at https://nextjs.org/docs/app/api-reference/file-conventions/metadata before writing from memory.

- Titles, descriptions, canonical and Open Graph tags: the `metadata` export or `generateMetadata` in a server component. A file with `"use client"` cannot export them.
- `robots.txt` and `sitemap.xml`: `src/app/robots.ts` and `src/app/sitemap.ts`.
- Social preview image: `opengraph-image` file convention.
- JSON-LD: a `<script type="application/ld+json">` rendered by the page.
