---
name: visual-compare
description: Compare how two builds of the site render (layout, computed styles, headings, console errors) on every route at several viewport widths. Use after changing styles, design tokens, UI components or page markup, to prove a refactor changed nothing or to list exactly what a visual change touched, and before committing such changes.
argument-hint: "[baseline: git ref or URL, default main]"
---

# Visual compare

Compares a baseline build with the working tree in headless Chrome and reports every difference in position, size, color, typography, borders, radii, shadows, heading outline and console errors.

Baseline: `$ARGUMENTS` if given, otherwise `main`.

## Steps

1. **Prepare the baseline.**
   - A URL is used as is. The production site works as "what is live now". Vercel preview URLs require a login and cannot be used.
   - A git ref has to be built outside the repository. In the Bash tool:

     ```bash
     BASE="$(mktemp -d)/base" && mkdir -p "$BASE"
     git archive <ref> | tar -x -C "$BASE"
     (cd "$BASE" && npm ci && npx next build)
     ```

2. **Build the candidate** in the repository root: `npx next build`.

3. **Run the comparison** from the repository root:

   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/compare.mjs" --base "<url or $BASE>"
   ```

   The script serves each directory with its own `next start` on a free port and stops it afterwards, so there are no ports or server processes to manage. Options:
   - `--routes home,projects/crowder` limits the routes. Without it, the script follows the links on the home page. Write routes without a leading slash: Git Bash rewrites arguments that start with `/` into Windows paths.
   - `--viewports 1920x1080,1440x900,768x1024,390x844` is the default. Add widths on both sides of a breakpoint (`767x1024,768x1024`) when breakpoints or responsive tokens change.
   - `--shots all` or `--shots home@1440,projects/crowder@390` saves full-page screenshots of both builds.
   - `--out <dir>` chooses where `report.txt` and screenshots go. The default is a new temp directory, printed at the end.

4. **Read the result.** Exit code 0 means identical, 1 means differences, 2 means the run failed.
   - `diff:` lines are differences between the builds. For a refactor each one is a regression to fix or to explain. For an intended visual change, check that the diffs are confined to what was meant to change.
   - `note:` lines are problems present in both builds, such as horizontal overflow on a narrow viewport. They are not regressions, but report them.
   - For an intended visual change, also read the screenshots: the report says what changed, not whether it looks right.

5. **Report** the number of routes and widths compared, the differences found, which of them were intended, and the notes.

6. **Clean up**: delete the temporary baseline directory.

## Limits

- Only the default state of each page is compared. Hover and focus styles, the open mobile menu and animations in progress are not covered; check them in a browser when they change.
- The WebGL background canvas is ignored.
- Chrome, Chromium or Edge must be installed. Set `CHROME_PATH` if it is not in a standard location.
