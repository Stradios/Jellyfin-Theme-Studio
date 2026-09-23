export const DEFAULT_OG_IMAGE = "https://user.uploads.dev/file/4b89bbe6a68500bd92ec1d9df9372cb7.jpg";
export const PAGE_TITLE_SUFFIX = "design a custom Jellyfin theme in your browser";

const TEMPLATE = /\[([A-Za-z_][A-Za-z0-9_]*)\]/;

export function parseMainPjs(text) {
  const meta = {};
  const top = {};
  let inMeta = false;
  for (const line of String(text).split(/\r?\n/)) {
    const bare = line.trim();
    if (!bare) continue;
    if (bare.charAt(0) === "$") {
      inMeta = bare === "$meta";
      continue;
    }
    const indented = /^\s/.test(line);
    const m = bare.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]*)$/);
    if (inMeta && indented) {
      if (m) meta[m[1]] = m[2].trim();
      continue;
    }
    inMeta = false;
    if (m) top[m[1]] = m[2].trim();
  }
  return { meta, top };
}

export function renderTemplates(html, values) {
  return String(html).replace(/\[([A-Za-z_][A-Za-z0-9_]*)\]/g, function (whole, name) {
    return Object.prototype.hasOwnProperty.call(values, name) ? values[name] : whole;
  });
}

export function findLeftoverTemplates(html) {
  const stripped = String(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const found = stripped.match(/\[[A-Za-z_][A-Za-z0-9_]*\]/g) || [];
  return Array.from(new Set(found));
}

export function faviconDataUri(iconSvg) {
  return "data:image/svg+xml," + encodeURIComponent(String(iconSvg).replace(/\s+/g, " ").trim());
}

export function assertIconMatchesGenerator(iconSvg, generatorHtml) {
  const norm = function (s) {
    return String(s).replace(/[\s"'+\\]/g, "");
  };
  const haystack = norm(generatorHtml);
  const missing = (String(iconSvg).match(/\sd="([^"]+)"/g) || [])
    .map(function (seg) {
      return seg.slice(4, -1);
    })
    .filter(function (d) {
      return haystack.indexOf(norm(d)) < 0;
    });
  if (missing.length) {
    throw new Error(
      "assets/icon.svg no longer matches the logo drawn in the generator's boot() " +
        "(" + missing.length + " path segment(s) not found). Update assets/icon.svg (and the " +
        "favicon) after changing the logo."
    );
  }
}

export function buildIndexHtml(opts) {
  const meta = opts.meta || {};
  const top = opts.top || {};
  const title = meta.title || top.title || "Jellyfin Theme Studio";
  const description = meta.description || "";
  const subtitle = top.subtitle || "";
  const icon = faviconDataUri(opts.iconSvg);
  const ogImage = opts.ogImage || meta.image || DEFAULT_OG_IMAGE;
  const pageTitle = title + " \u2014 " + PAGE_TITLE_SUFFIX;
  const values = { title: title, subtitle: subtitle };
  const body = renderTemplates(opts.generatorHtml, values);
  const leftover = findLeftoverTemplates(body);
  if (leftover.length) {
    throw new Error("unsubstituted perchance template(s) left in the page body: " + leftover.join(", "));
  }
  const esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  };
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + esc(pageTitle) + "</title>",
    description ? '<meta name="description" content="' + esc(description) + '">' : "",
    '<meta name="color-scheme" content="dark">',
    '<meta name="theme-color" content="#0b0e13">',
    '<link rel="icon" href="' + esc(icon) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + esc(pageTitle) + '">',
    description ? '<meta property="og:description" content="' + esc(description) + '">' : "",
    '<meta property="og:image" content="' + esc(ogImage) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(pageTitle) + '">',
    description ? '<meta name="twitter:description" content="' + esc(description) + '">' : "",
    '<meta name="twitter:image" content="' + esc(ogImage) + '">',
    "</head>",
    "<body>",
    body.trim(),
    "<noscript>This studio is a JavaScript app. Enable JavaScript to design your Jellyfin theme.</noscript>",
    "</body>",
    "</html>",
    "",
  ]
    .filter(function (line) {
      return line !== "";
    })
    .join("\n");
}

export function buildSite(input) {
  const parsed = parseMainPjs(input.generatorPjs);
  if (input.iconSvg) assertIconMatchesGenerator(input.iconSvg, input.generatorHtml);
  return {
    "index.html": buildIndexHtml({
      generatorHtml: input.generatorHtml,
      meta: parsed.meta,
      top: parsed.top,
      iconSvg: input.iconSvg,
      ogImage: input.ogImage,
    }),
  };
}
