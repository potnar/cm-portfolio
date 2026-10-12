#!/usr/bin/env node
// Renders two builds of the site in headless Chrome and reports every difference in
// geometry, computed style, headings and console errors, route by route and width by width.
//
// usage: node compare.mjs --base <url|dir> [--new <url|dir>] [options]
//   --base       baseline: a URL, or a directory holding a built Next.js app
//   --new        candidate, same forms (default: current directory)
//   --routes     comma-separated paths, leading slash optional (default: links found on the home page)
//   --viewports  comma-separated WxH list (default: 1920x1080,1440x900,768x1024,390x844)
//   --shots      none | all | comma-separated route@width, e.g. home@1440 (default: none)
//   --out        directory for report.txt and screenshots (default: a new temp directory)
// exit code: 0 identical, 1 differences found, 2 could not run
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

if (typeof WebSocket === "undefined") {
  console.error("Node 22 or newer is required (global WebSocket).");
  process.exit(2);
}

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  if (!key.startsWith("--") || process.argv[i + 1] === undefined) {
    console.error(
      `Bad argument: ${key}. See the usage comment at the top of this file.`,
    );
    process.exit(2);
  }
  args[key.slice(2)] = process.argv[i + 1];
}
if (!args.base) {
  console.error("Missing --base <url|dir>.");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const outDir = path.resolve(
  args.out ?? fs.mkdtempSync(path.join(os.tmpdir(), "visual-compare-")),
);
fs.mkdirSync(outDir, { recursive: true });

const viewports = (args.viewports ?? "1920x1080,1440x900,768x1024,390x844")
  .split(",")
  .map((v) => v.split("x").map(Number));
// "home", "." and "" all mean "/"; a leading slash is optional so Git Bash cannot rewrite it into a Windows path.
const toRoute = (r) =>
  ["", ".", "home", "/"].includes(r.trim())
    ? "/"
    : "/" + r.trim().replace(/^\/+/, "");
const shots = args.shots ?? "none";
const wantShot = (route, width) =>
  shots === "all" ||
  (shots !== "none" &&
    shots.split(",").some((s) => {
      const [r, w] = s.split("@");
      return toRoute(r) === route && Number(w) === width;
    }));

const children = [];
function stop(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32")
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
  else child.kill("SIGTERM");
}
const cleanup = () => children.forEach(stop);
process.on("SIGINT", () => {
  cleanup();
  process.exit(2);
});

const freePort = () =>
  new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });

// A URL is used as is; a directory is served with its own `next start` and stopped when we finish.
async function resolveTarget(value, label) {
  if (/^https?:\/\//.test(value)) return value.replace(/\/+$/, "");
  const dir = path.resolve(value);
  const nextBin = path.join(dir, "node_modules", "next", "dist", "bin", "next");
  if (!fs.existsSync(path.join(dir, ".next", "BUILD_ID")))
    throw new Error(
      `${label}: no production build in ${dir}. Run "npx next build" there first.`,
    );
  if (!fs.existsSync(nextBin))
    throw new Error(
      `${label}: dependencies are not installed in ${dir}. Run "npm ci" there first.`,
    );
  const port = await freePort();
  const child = spawn(
    process.execPath,
    [nextBin, "start", "-p", String(port)],
    { cwd: dir, stdio: "ignore" },
  );
  children.push(child);
  const origin = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null)
      throw new Error(
        `${label}: "next start" exited with code ${child.exitCode} in ${dir}.`,
      );
    try {
      if ((await fetch(origin + "/")).status < 500) return origin;
    } catch {
      /* not listening yet */
    }
    await sleep(250);
  }
  throw new Error(`${label}: server in ${dir} did not answer within 30 s.`);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((c) => c && fs.existsSync(c));
  if (!found)
    throw new Error(
      "Chrome not found. Set CHROME_PATH to a Chrome, Chromium or Edge executable.",
    );
  return found;
}

let debugPort;
async function http(pathname, method = "GET") {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}${pathname}`, {
        method,
      });
      return await res.json().catch(() => ({}));
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome did not open its debugging port.");
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const listeners = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error)));
        else res(msg.result);
      } else if (msg.method) {
        (listeners.get(msg.method) ?? []).forEach((fn) => fn(msg.params));
      }
    };
    ws.onerror = reject;
    ws.onopen = () =>
      resolve({
        send: (method, params = {}) =>
          new Promise((res, rej) => {
            pending.set(++id, { res, rej });
            ws.send(JSON.stringify({ id, method, params }));
          }),
        on: (method, fn) =>
          listeners.set(method, [...(listeners.get(method) ?? []), fn]),
        once: (method) =>
          new Promise((res) =>
            listeners.set(method, [...(listeners.get(method) ?? []), res]),
          ),
        close: () => ws.close(),
      });
  });
}

// Runs in the page: scroll through it so in-view animations finish, then record what is painted.
const COLLECT = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const step = innerHeight * 0.8;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await sleep(200); }
  scrollTo(0, document.documentElement.scrollHeight); await sleep(300);
  scrollTo(0, 0); await sleep(1800);

  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  const rgba = (c) => {
    if (cache.has(c)) return cache.get(c);
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
    const d = [...ctx.getImageData(0, 0, 1, 1).data];
    cache.set(c, d); return d;
  };
  const r2 = (n) => Math.round(n * 2) / 2;
  // Builds made on different machines can differ in the last digits of computed colors and matrices.
  const num = (s) => s.replace(/-?\\d*\\.\\d+(e-?\\d+)?/g, (n) => String(Math.round(parseFloat(n) * 1000) / 1000));
  const texts = [], boxes = [], icons = [];
  for (const el of document.body.querySelectorAll("*")) {
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "canvas", "next-route-announcer", "nextjs-portal"].includes(tag)) continue;
    if (el.closest("next-route-announcer, nextjs-portal")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const geo = { x: r2(r.left), y: r2(r.top + scrollY), w: r2(r.width), h: r2(r.height) };
    if (el.closest("svg") && tag !== "svg") continue;
    if (tag === "svg") { icons.push({ ...geo, color: rgba(cs.color) }); continue; }
    const direct = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).filter(Boolean).join(" ");
    if (direct) texts.push({ t: direct.slice(0, 70), ...geo, color: rgba(cs.color), size: cs.fontSize, weight: cs.fontWeight, ls: cs.letterSpacing, lh: cs.lineHeight, tt: cs.textTransform, style: cs.fontStyle, family: cs.fontFamily.slice(0, 40), clip: cs.backgroundClip, bgimg: cs.backgroundClip === "text" ? num(cs.backgroundImage) : "", op: cs.opacity, tf: num(cs.transform) });
    const bw = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth];
    const hasBg = rgba(cs.backgroundColor)[3] > 0 || (cs.backgroundImage !== "none" && cs.backgroundClip !== "text");
    const hasBorder = bw.some((w) => parseFloat(w) > 0);
    if (hasBg || hasBorder || cs.boxShadow !== "none") boxes.push({ ...geo, bg: rgba(cs.backgroundColor), bgimg: cs.backgroundClip === "text" ? "" : num(cs.backgroundImage), bw: bw.join(" "), bc: hasBorder ? [rgba(cs.borderTopColor), rgba(cs.borderBottomColor), rgba(cs.borderLeftColor)] : [], bstyle: hasBorder ? cs.borderTopStyle + "/" + cs.borderBottomStyle : "", br: cs.borderTopLeftRadius, shadow: num(cs.boxShadow), op: cs.opacity, tf: num(cs.transform), bf: cs.backdropFilter });
  }
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => h.tagName + ": " + h.textContent.trim().slice(0, 50));
  const links = [...document.querySelectorAll("a[href]")].map((a) => new URL(a.href, location.href)).filter((u) => u.origin === location.origin).map((u) => u.pathname);
  return { texts, boxes, icons, headings, links, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth, bodyBg: rgba(getComputedStyle(document.body).backgroundColor) };
})()`;

async function capture(origin, route, [w, h], shotFile) {
  const tab = await http(`/json/new?about:blank`, "PUT");
  const c = await connect(tab.webSocketDebuggerUrl);
  const errors = [];
  c.on("Runtime.exceptionThrown", (p) =>
    errors.push(
      "EXC " +
        (
          p.exceptionDetails.exception?.description ?? p.exceptionDetails.text
        ).slice(0, 200),
    ),
  );
  c.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error")
      errors.push(
        "CONSOLE " +
          p.args
            .map((a) => a.value ?? a.description ?? "")
            .join(" ")
            .slice(0, 200),
      );
  });
  await c.send("Page.enable");
  await c.send("Runtime.enable");
  await c.send("Emulation.setDeviceMetricsOverride", {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: w < 500,
  });
  const loaded = c.once("Page.loadEventFired");
  await c.send("Page.navigate", { url: origin + route });
  await loaded;
  await sleep(800);
  const { result, exceptionDetails } = await c.send("Runtime.evaluate", {
    expression: COLLECT,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails)
    throw new Error(
      "Could not read the page: " +
        JSON.stringify(exceptionDetails).slice(0, 400),
    );
  if (shotFile) {
    const { cssContentSize } = await c.send("Page.getLayoutMetrics");
    const shot = await c.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: cssContentSize.width,
        height: cssContentSize.height,
        scale: 1,
      },
    });
    fs.writeFileSync(
      path.join(outDir, shotFile),
      Buffer.from(shot.data, "base64"),
    );
  }
  c.close();
  await http(`/json/close/${tab.id}`);
  return { ...result.value, errors: [...new Set(errors)] };
}

// Color channels are compared with a small tolerance; every other value must match exactly.
const near = (a, b) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((v, i) =>
    Array.isArray(v) ? near(v, b[i]) : Math.abs(v - b[i]) <= 6,
  );
const same = (a, b) => (Array.isArray(a) ? near(a, b) : a === b);
const diffFields = (a, b) =>
  Object.keys(a)
    .filter((k) => !same(a[k], b[k]))
    .map((k) => `${k}: ${JSON.stringify(a[k])} -> ${JSON.stringify(b[k])}`);
// Greedy multiset match: pair identical entries first, report what is left on each side.
function unmatched(listA, listB) {
  const restB = [...listB];
  const onlyA = [];
  for (const a of listA) {
    const i = restB.findIndex((b) => diffFields(a, b).length === 0);
    if (i >= 0) restB.splice(i, 1);
    else onlyA.push(a);
  }
  return [onlyA, restB];
}

function compare(a, b, width) {
  const diffs = [];
  const notes = [];
  if (a.docH !== b.docH || a.docW !== b.docW)
    diffs.push(`document size: ${a.docW}x${a.docH} -> ${b.docW}x${b.docH}`);
  if (!near(a.bodyBg, b.bodyBg))
    diffs.push(`body background: ${a.bodyBg} -> ${b.bodyBg}`);
  if (b.docW > width) {
    const line = `horizontal overflow: page is ${b.docW}px wide in a ${width}px viewport`;
    if (a.docW === b.docW) notes.push(line + " (same in baseline)");
    else diffs.push(line);
  }
  const byText = (list) =>
    list.reduce((m, t) => m.set(t.t, [...(m.get(t.t) ?? []), t]), new Map());
  const ta = byText(a.texts);
  const tb = byText(b.texts);
  for (const t of new Set([...ta.keys(), ...tb.keys()])) {
    const la = ta.get(t) ?? [];
    const lb = tb.get(t) ?? [];
    if (la.length !== lb.length) {
      diffs.push(`text "${t}": appears ${la.length}x -> ${lb.length}x`);
      continue;
    }
    la.forEach((x, i) => {
      const d = diffFields(x, lb[i]);
      if (d.length) diffs.push(`text "${t.slice(0, 40)}": ${d.join("; ")}`);
    });
  }
  const [boxA, boxB] = unmatched(a.boxes, b.boxes);
  boxA.forEach((x) => diffs.push(`box only in baseline: ${JSON.stringify(x)}`));
  boxB.forEach((x) =>
    diffs.push(`box only in candidate: ${JSON.stringify(x)}`),
  );
  const [icA, icB] = unmatched(a.icons, b.icons);
  icA.forEach((x) => diffs.push(`icon only in baseline: ${JSON.stringify(x)}`));
  icB.forEach((x) =>
    diffs.push(`icon only in candidate: ${JSON.stringify(x)}`),
  );
  if (JSON.stringify(a.headings) !== JSON.stringify(b.headings))
    diffs.push(
      `headings baseline: ${a.headings.join(" | ")}\n    headings candidate: ${b.headings.join(" | ")}`,
    );
  if (JSON.stringify(a.errors) !== JSON.stringify(b.errors))
    diffs.push(
      `console errors: ${JSON.stringify(a.errors)} -> ${JSON.stringify(b.errors)}`,
    );
  else if (b.errors.length)
    notes.push(
      `console errors (same in baseline): ${JSON.stringify(b.errors)}`,
    );
  return { diffs, notes };
}

async function main() {
  const base = await resolveTarget(args.base, "--base");
  const cand = await resolveTarget(args.new ?? ".", "--new");

  debugPort = await freePort();
  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${path.join(outDir, "chrome-profile")}`,
      "--enable-unsafe-swiftshader",
      "--hide-scrollbars",
      "--no-first-run",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  children.push(chrome);

  let routes;
  if (args.routes) {
    routes = [...new Set(args.routes.split(",").map(toRoute))];
  } else {
    const homes = await Promise.all([
      capture(base, "/", [1440, 900]),
      capture(cand, "/", [1440, 900]),
    ]);
    const found = homes
      .flatMap((h) => h.links)
      .filter((p) => !/\.[a-z0-9]+$/i.test(p));
    routes = [
      ...new Set([
        "/",
        ...found.map((p) => (p.length > 1 ? p.replace(/\/+$/, "") : p)),
      ]),
    ].sort();
  }

  const report = [
    `baseline:  ${base}`,
    `candidate: ${cand}`,
    `routes:    ${routes.join(", ")}`,
    "",
  ];
  let diffCount = 0;
  let noteCount = 0;
  for (const route of routes) {
    for (const vp of viewports) {
      const slug =
        (route === "/" ? "home" : route.slice(1).replace(/\W+/g, "_")) +
        "_" +
        vp[0];
      const shot = wantShot(route, vp[0]);
      const a = await capture(
        base,
        route,
        vp,
        shot ? `base_${slug}.png` : null,
      );
      const b = await capture(cand, route, vp, shot ? `new_${slug}.png` : null);
      const { diffs, notes } = compare(a, b, vp[0]);
      diffCount += diffs.length;
      noteCount += notes.length;
      const counts = `texts=${b.texts.length} boxes=${b.boxes.length} icons=${b.icons.length}`;
      report.push(
        `${route} @${vp[0]}  ${counts}  ${diffs.length ? `DIFFERENCES: ${diffs.length}` : "identical"}`,
      );
      diffs.forEach((d) => report.push("  diff: " + d));
      notes.forEach((n) => report.push("  note: " + n));
    }
  }
  report.push(
    "",
    `${routes.length} routes x ${viewports.length} widths. Differences: ${diffCount}. Notes: ${noteCount}.`,
  );
  report.push(`Output directory: ${outDir}`);
  fs.writeFileSync(path.join(outDir, "report.txt"), report.join("\n"));
  console.log(report.join("\n"));
  return diffCount ? 1 : 0;
}

main()
  .then((code) => {
    cleanup();
    process.exit(code);
  })
  .catch((err) => {
    cleanup();
    console.error("compare failed: " + err.message);
    process.exit(2);
  });
