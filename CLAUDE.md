# CM Portfolio

Personal portfolio of Mikołaj Cholewa. Next.js 16 (App Router), React 19, Tailwind CSS 4, deployed on Vercel.

## Language

- Reply to the owner in Polish.
- Site copy is Polish, with correct diacritics. Code, comments, commit messages and these instruction files are English.

## Checks

Run all four before proposing a commit:

- `npx tsc --noEmit`
- `npm run lint`
- `npx --yes prettier@3 --end-of-line auto --check "src/**/*.{ts,tsx,css}"`. Prettier is not a dependency and has no config file; the source follows its defaults.
- `npm run build`

## Git and deployment

- Pushing to `main` deploys to production on Vercel. Work on a feature branch; every pushed branch gets a preview deployment.
- Commit messages use Conventional Commits prefixes (`feat:`, `fix:`, `refactor:`, `chore:`) and a body that says why.
- The repository is public. Never commit secrets, tokens or anything from `.env*`.

## Working rules

- Next.js 16 and Tailwind CSS 4 differ from older versions in ways that are easy to get wrong from memory: Tailwind is configured in `src/app/globals.css` (there is no `tailwind.config`), route `params` are Promises, and a `"use client"` file cannot export `metadata`. Read the current docs when unsure.
- Check every change to styles, tokens, components or page markup with the `visual-compare` skill before reporting it as done. A refactor has to come out identical.
- Measure SEO, metadata and bundle-size work with the `site-audit` skill, before and after.
- Do not change how the site looks until the owner has approved the direction.

## Design direction

The owner wants the site to look as modern as possible. For visual work, load the `frontend-design` skill first and present the direction (palette, type, layout) for approval before implementing it.
