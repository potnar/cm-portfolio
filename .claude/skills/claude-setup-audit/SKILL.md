---
name: claude-setup-audit
description: Check this repository's Claude Code setup (CLAUDE.md, .claude/rules, project skills, .claude/settings.json, plugins) against Anthropic's current documentation and report what is invalid, outdated or missing. Use when asked whether the Claude configuration is correct, up to date or follows the docs, after adding or editing skills, rules, settings or plugins, and after a Claude Code upgrade.
---

# Claude setup audit

Verifies the Claude Code configuration in this repository against the documentation as it is today. The docs change weekly, so read them during the audit; do not rely on memory.

## Steps

1. **Take inventory.** List `CLAUDE.md`, `CLAUDE.local.md`, `.claude/rules/`, `.claude/skills/`, `.claude/settings.json`, `.claude/settings.local.json` and `.mcp.json`, and note which exist. Record the versions and plugins:

   ```bash
   claude --version
   claude plugin list
   ```

2. **Run the local validators** and keep their output as evidence:

   ```bash
   claude plugin validate .claude/skills --strict
   claude doctor
   node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('settings.json parses')"
   ```

3. **Read the current documentation.** Fetch the index at https://code.claude.com/docs/llms.txt, then the pages for each kind of file that exists here:
   - `memory.md` for CLAUDE.md and `.claude/rules/`
   - `skills.md` for skills
   - `settings.md` and `settings-reference.md` for settings and permissions
   - `plugins/install.md`, `plugins/security.md` and `plugins/anthropic-marketplaces.md` for plugins
   - `claude-directory.md` for where each file belongs
   - `whats-new/index.md` for features added since the installed version was released

4. **Compare the setup with what the pages say.** Check at least:
   - **CLAUDE.md**: located at the repository root or in `.claude/`; within the size the docs recommend; instructions concrete enough to verify; nothing Claude can derive by reading the code; no contradiction with the rules; every file and command it names exists.
   - **Rules**: Markdown files in `.claude/rules/`; `paths` is the only frontmatter field; each glob matches files that exist.
   - **Skills**: one folder per skill with `SKILL.md` inside; every frontmatter field is in the documented reference; the description states what the skill does and when to use it, with the main use case first, within the documented length cap; `SKILL.md` within the recommended length; every script it references exists and runs; no skill name shadows a bundled skill by accident.
   - **Settings**: strict JSON with the documented `$schema`; permission rules in the documented syntax; nothing personal in the committed file; `.claude/settings.local.json` not tracked by git.
   - **Plugins**: each `enabledPlugins` id has the form `name@marketplace`; the marketplace is one of Anthropic's or was deliberately trusted; the plugin is installed on this machine; binaries a plugin needs are on `PATH`; the plugin is still used.
   - **New features**: anything in What's new that replaces something hand-written here.

5. **Report** one row per check: the check, pass or fail, the evidence, and the URL of the page that defines it. Propose edits for the failures. Apply them only after the user agrees.

6. **Hand over the interactive checks.** These run only when the user types them in a session, so list them at the end of the report:
   - `/context`: confirms CLAUDE.md appears under Memory files and shows what the skill listing costs
   - `/doctor`: setup checkup, including CLAUDE.md content that can be derived from the code
   - `/doctor prompt-audit`: looks for outdated or conflicting instructions
   - `/skill-doctor`: shows which skills are never used
   - `/status`: shows which settings files loaded
