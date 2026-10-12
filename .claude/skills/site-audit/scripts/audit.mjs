#!/usr/bin/env node
// Reads the prerendered HTML of a built Next.js app and reports, per route, what search engines
// and browsers receive: head tags, heading outline, link and image accessibility, and the weight
// of the JS, CSS and fonts the page loads.
//
// usage: node audit.mjs [--dir <app dir>] [--lang pl] [--js-budget 200] [--json]
//   --dir        directory holding the build (default: current directory)
//   --lang       expected <html lang>; a different value is reported as a finding
//   --js-budget  gzip kB of JavaScript per route above which a finding is reported (default: 200)
//   --json       print the full result as JSON instead of the text report
// exit code: 0 report printed, 2 could not run. Findings never change the exit code.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key === "--json") args.json = true;
  else if (key.startsWith("--") && process.argv[i + 1] !== undefined)
    args[key.slice(2)] = process.argv[++i];
  else {
    console.error(
      `Bad argument: ${key}. See the usage comment at the top of this file.`,
    );
    process.exit(2);
  }
}

const root = path.resolve(args.dir ?? ".");
const appDir = path.join(root, ".next", "server", "app");
if (!fs.existsSync(appDir)) {
  console.error(`No build found in ${root}. Run "npx next build" there first.`);
  process.exit(2);
}
const jsBudget = Number(args["js-budget"] ?? 200);

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const attrs = (tag) => {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g))
    out[m[1].toLowerCase()] = decode(m[2] ?? "");
  return out;
};
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, "gi"))].map((m) =>
    attrs(m[1]),
  );
const text = (html) =>
  decode(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

function htmlFiles(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory())
      return htmlFiles(path.join(dir, e.name), `${prefix}${e.name}/`);
    if (!e.name.endsWith(".html") || e.name.startsWith("_")) return [];
    const name = e.name.slice(0, -5);
    return [
      {
        route:
          "/" + (prefix + (name === "index" ? "" : name)).replace(/\/$/, ""),
        file: path.join(dir, e.name),
      },
    ];
  });
}

const sizeCache = new Map();
function weigh(url) {
  const clean = url.split("?")[0];
  if (!clean.startsWith("/_next/static/")) return null;
  if (!sizeCache.has(clean)) {
    const file = path.join(
      root,
      ".next",
      "static",
      clean.slice("/_next/static/".length),
    );
    if (!fs.existsSync(file)) sizeCache.set(clean, null);
    else {
      const buf = fs.readFileSync(file);
      // Fonts are already compressed, so their transfer size is the file size.
      sizeCache.set(clean, {
        raw: buf.length,
        gzip: /\.woff2?$/.test(clean) ? buf.length : zlib.gzipSync(buf).length,
      });
    }
  }
  return sizeCache.get(clean);
}
const total = (urls) =>
  urls.reduce(
    (sum, u) => {
      const s = weigh(u);
      return s
        ? {
            files: sum.files + 1,
            raw: sum.raw + s.raw,
            gzip: sum.gzip + s.gzip,
          }
        : sum;
    },
    { files: 0, raw: 0, gzip: 0 },
  );
const kb = (n) => (n / 1024).toFixed(1);

function auditRoute({ route, file }) {
  const html = fs.readFileSync(file, "utf8");
  const metas = tags(html, "meta");
  const links = tags(html, "link");
  const meta = (key) =>
    metas.find((m) => m.name === key || m.property === key)?.content ?? null;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  const jsonLd = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].flatMap((m) => {
    try {
      const data = JSON.parse(m[1]);
      return (Array.isArray(data) ? data : (data["@graph"] ?? [data])).map(
        (d) => String(d["@type"]),
      );
    } catch {
      return ["(invalid JSON)"];
    }
  });
  const headings = [
    ...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map((m) => ({
    level: Number(m[1]),
    text: text(m[2]),
  }));
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    (m) => ({ ...attrs(m[1]), inner: m[2] }),
  );
  const imgs = tags(html, "img");

  const scripts = [
    ...tags(html, "script")
      .filter((s) => s.src && !("nomodule" in s))
      .map((s) => s.src),
    ...links
      .filter((l) => l.rel === "preload" && l.as === "script")
      .map((l) => l.href),
  ];
  const styles = links.filter((l) => l.rel === "stylesheet").map((l) => l.href);
  const fonts = links
    .filter((l) => l.rel === "preload" && l.as === "font")
    .map((l) => l.href);
  const js = total([...new Set(scripts)]);
  const css = total([...new Set(styles)]);
  const font = total([...new Set(fonts)]);
  const largestJs = [...new Set(scripts)]
    .map((u) => ({ u, s: weigh(u) }))
    .filter((x) => x.s)
    .sort((a, b) => b.s.gzip - a.s.gzip)[0];

  const seo = {
    lang: html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1] ?? null,
    title: title ? decode(title[1]) : null,
    description: meta("description"),
    canonical: links.find((l) => l.rel === "canonical")?.href ?? null,
    robots: meta("robots"),
    ogTitle: meta("og:title"),
    ogDescription: meta("og:description"),
    ogImage: meta("og:image"),
    ogUrl: meta("og:url"),
    twitterCard: meta("twitter:card"),
    jsonLd,
  };

  const findings = [];
  const add = (area, message) => findings.push({ area, message });
  if (args.lang && seo.lang !== args.lang)
    add("seo", `<html lang> is "${seo.lang}", expected "${args.lang}"`);
  if (!seo.title) add("seo", "no <title>");
  else if (seo.title.length > 60)
    add(
      "seo",
      `title is ${seo.title.length} characters; search results cut it near 60`,
    );
  if (!seo.description) add("seo", "no meta description");
  else if (seo.description.length < 70 || seo.description.length > 160)
    add(
      "seo",
      `meta description is ${seo.description.length} characters; aim for 70-160`,
    );
  if (!seo.canonical) add("seo", "no canonical link");
  if (!seo.ogTitle || !seo.ogDescription || !seo.ogImage)
    add(
      "seo",
      "Open Graph tags incomplete (og:title, og:description, og:image)",
    );
  if (!seo.twitterCard) add("seo", "no twitter:card");
  if (!jsonLd.length) add("seo", "no JSON-LD structured data");
  if (/noindex/i.test(seo.robots ?? ""))
    add("seo", `robots meta is "${seo.robots}"`);

  const h1 = headings.filter((h) => h.level === 1);
  if (h1.length !== 1)
    add("outline", `${h1.length} h1 elements; expected exactly 1`);
  headings.forEach((h, i) => {
    const prev = headings[i - 1];
    if (prev && h.level > prev.level + 1)
      add(
        "outline",
        `heading level jumps from h${prev.level} to h${h.level} at "${h.text.slice(0, 40)}"`,
      );
  });

  const unnamed = anchors.filter((a) => {
    const alt = [...a.inner.matchAll(/<img\b[^>]*\balt="([^"]+)"/gi)].length;
    return !text(a.inner) && !a["aria-label"] && !a.title && !alt;
  });
  if (unnamed.length)
    add(
      "a11y",
      `${unnamed.length} links have no text or aria-label: ${[...new Set(unnamed.map((a) => a.href))].join(", ")}`,
    );
  const dead = anchors.filter((a) => a.href === "#" || a.href === "");
  if (dead.length)
    add(
      "a11y",
      `${dead.length} links point to "#": ${dead.map((a) => `"${text(a.inner)}"`).join(", ")}`,
    );
  const unsafe = anchors.filter(
    (a) => a.target === "_blank" && !/noopener|noreferrer/.test(a.rel ?? ""),
  );
  if (unsafe.length)
    add(
      "a11y",
      `${unsafe.length} target="_blank" links lack rel="noopener noreferrer"`,
    );
  const noAlt = imgs.filter((i) => !("alt" in i));
  if (noAlt.length) add("a11y", `${noAlt.length} images have no alt attribute`);

  if (js.gzip / 1024 > jsBudget)
    add(
      "perf",
      `JavaScript is ${kb(js.gzip)} kB gzip, over the ${jsBudget} kB budget; largest file ${kb(largestJs.s.gzip)} kB (${path.basename(largestJs.u)})`,
    );

  return { route, seo, headings, weight: { js, css, font }, findings };
}

const routes = htmlFiles(appDir)
  .map(auditRoute)
  .sort((a, b) => a.route.localeCompare(b.route));
if (!routes.length) {
  console.error(
    `No prerendered pages in ${appDir}. Dynamic routes are not covered by this audit.`,
  );
  process.exit(2);
}

const site = [];
const exists = (...rel) => rel.some((r) => fs.existsSync(path.join(root, r)));
if (
  !exists(
    "public/robots.txt",
    "src/app/robots.ts",
    "src/app/robots.js",
    "app/robots.ts",
    "app/robots.js",
    "src/app/robots.txt",
    "app/robots.txt",
  )
)
  site.push({ area: "seo", message: "no robots.txt (add src/app/robots.ts)" });
if (
  !exists(
    "public/sitemap.xml",
    "src/app/sitemap.ts",
    "src/app/sitemap.js",
    "app/sitemap.ts",
    "app/sitemap.js",
    "src/app/sitemap.xml",
    "app/sitemap.xml",
  )
)
  site.push({
    area: "seo",
    message: "no sitemap.xml (add src/app/sitemap.ts)",
  });
for (const field of ["title", "description"]) {
  const seen = new Map();
  routes.forEach(
    (r) =>
      r.seo[field] &&
      seen.set(r.seo[field], [...(seen.get(r.seo[field]) ?? []), r.route]),
  );
  for (const [value, where] of seen)
    if (where.length > 1)
      site.push({
        area: "seo",
        message: `${where.length} routes share the same ${field} ("${value.slice(0, 50)}"): ${where.join(", ")}`,
      });
}

// A finding present on every route is a template problem: report it once instead of once per page.
const key = (f) => `${f.area}|${f.message}`;
const shared =
  routes.length > 1
    ? routes[0].findings.filter((f) =>
        routes.every((r) => r.findings.some((g) => key(g) === key(f))),
      )
    : [];
const sharedKeys = new Set(shared.map(key));
routes.forEach(
  (r) => (r.findings = r.findings.filter((f) => !sharedKeys.has(key(f)))),
);

if (args.json) {
  console.log(
    JSON.stringify({ root, site, everyRoute: shared, routes }, null, 2),
  );
  process.exit(0);
}

const out = [`Build: ${root}`, `${routes.length} prerendered routes`, ""];
out.push("Weight per route (gzip kB; fonts are preloaded files only)");
out.push(
  "  route".padEnd(34) +
    "JS".padStart(8) +
    "CSS".padStart(8) +
    "fonts".padStart(8),
);
routes.forEach((r) =>
  out.push(
    ("  " + r.route).padEnd(34) +
      kb(r.weight.js.gzip).padStart(8) +
      kb(r.weight.css.gzip).padStart(8) +
      kb(r.weight.font.gzip).padStart(8),
  ),
);
out.push("", `Site-wide findings: ${site.length}`);
site.forEach((f) => out.push(`  [${f.area}] ${f.message}`));
out.push("", `Findings on every route: ${shared.length}`);
shared.forEach((f) => out.push(`  [${f.area}] ${f.message}`));
for (const r of routes) {
  out.push("", `${r.route}  own findings: ${r.findings.length}`);
  out.push(`  title: ${r.seo.title ?? "(none)"}`);
  out.push(`  description: ${r.seo.description ?? "(none)"}`);
  out.push(
    `  lang: ${r.seo.lang ?? "(none)"}  canonical: ${r.seo.canonical ?? "(none)"}  json-ld: ${r.seo.jsonLd.join(", ") || "(none)"}`,
  );
  out.push(`  outline: ${r.headings.map((h) => `h${h.level}`).join(" ")}`);
  r.findings.forEach((f) => out.push(`  [${f.area}] ${f.message}`));
}
const own = routes.reduce((n, r) => n + r.findings.length, 0);
out.push(
  "",
  `Findings: ${site.length} site-wide, ${shared.length} on every route, ${own} on single routes.`,
);
console.log(out.join("\n"));
