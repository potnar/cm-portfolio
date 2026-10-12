---
paths:
  - "src/**/*.{ts,tsx,css}"
---

# Design system

Tailwind CSS 4 is configured in CSS: every token lives in the `@theme` block of `src/app/globals.css`. There is no `tailwind.config` file.

- **Colors**: use the semantic tokens (`text-muted`, `bg-surface`, `border-border`, `text-primary` and the rest of the `--color-*` list). Do not add raw palette classes such as `text-zinc-400` or `bg-white/5`. The raw classes still present in `src/app/projects/*` predate the tokens; replace them, do not copy them.
- **Accent**: a page sets `data-accent` to `cyan`, `blue`, `emerald`, `orange` or `purple` on a wrapper and uses `text-accent`, `bg-accent` and `border-accent` inside it.
- **Type**: headings and leads use the named styles `text-display`, `text-title`, `text-heading-xl`, `text-heading-lg`, `text-heading-md`, `text-heading-sm`, `text-lead`, `text-eyebrow` and `text-label`. Each sets size, line height, tracking and weight, so add `font-*`, `tracking-*` or `leading-*` next to one only to override it on purpose. Body copy uses `text-xs` to `text-lg`.
- **Radius**: only `rounded-sm`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` and `rounded-full` exist. Any other radius class generates no CSS.
- **Spacing**: `gutter` is the horizontal page padding; `section` and `section-sm` are the vertical rhythm between blocks. Use them as `px-gutter`, `py-section`, `mb-section-sm`.
- **Components**: build from `src/components/ui` before writing new markup. Keep those components free of `"use client"` so server components can use them.
- **New token names**: when adding a text, spacing or container token, also add its name to `extendTailwindMerge` in `src/lib/utils.ts`. Without that, `cn()` mistakes the class for a color or drops it when merging.
- **Token values** for color, type, radius and spacing are literal (`oklch()`, `rgb()`, `rem`), not `var()` or `color-mix()`, so they can be exported to a design system unchanged. The scoped `--accent` is the one exception.
- **Quality floor**: text contrast of at least 4.5:1, a visible keyboard focus state, and motion that respects `prefers-reduced-motion`.
