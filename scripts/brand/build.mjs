/*
 * Brand asset generator. `pnpm brand` writes one SVG and one PNG per entry in
 * ASSETS, into brand/. Both are committed: the SVGs are the crisp masters, the
 * PNGs are what LinkedIn and Workspace actually accept.
 *
 * Two things here are worth knowing before changing anything.
 *
 * Canvases are measured, not guessed. Every asset renders its content once on
 * an oversized probe canvas, reads the ink bounding box back out, and only
 * then computes a viewBox that contains that box plus its clear space at the
 * required aspect ratio. The previous generator hardcoded both the canvas and
 * the text origin, and the width of a line of text depends on the font that
 * actually resolves at render time, so the numbers were a guess. They were
 * wrong: the red period fell off the right edge of the 400x400 logo, which is
 * the file the README nominated for the LinkedIn company logo. Measuring makes
 * that class of bug impossible rather than fixed.
 *
 * The font is checked, not assumed. sharp's SVG renderer resolves families
 * through fontconfig and silently substitutes when one is missing, and it
 * ignores an @font-face with an embedded woff2 entirely (an embedded face
 * measures identically to a family that does not exist, which is how that was
 * established). So Inter has to be installed on the machine doing the build,
 * and the alternative to checking is shipping a wordmark in the wrong
 * typeface without noticing.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'brand');

const TOKENS = {
  colors: {
    paper: '#fbf4f0',
    ink: '#1a1a1a',
    accent: '#d63333',
    muted: '#7d7d7d',
  },
  font: 'Inter',
  weights: { regular: 400, medium: 500, bold: 700 },
  letterSpacing: {
    wordmark: '-0.06em',
    wordmarkBanner: '-0.05em',
    slogan: '-0.01em',
    sloganLarge: '-0.02em',
    micro: '0.18em',
  },
};

/* Composition primitives ------------------------------------------------- */

function wordmarkStacked({
  x,
  y1,
  y2,
  size,
  fill = TOKENS.colors.ink,
  accentFill = TOKENS.colors.accent,
  weight = TOKENS.weights.medium,
  letterSpacing = TOKENS.letterSpacing.wordmark,
}) {
  const attrs = `font-family="${TOKENS.font}" font-weight="${weight}" font-size="${size}" letter-spacing="${letterSpacing}" fill="${fill}"`;
  return [
    `<text x="${x}" y="${y1}" ${attrs}>VOGLER</text>`,
    `<text x="${x}" y="${y2}" ${attrs}>CONSULTING<tspan fill="${accentFill}">.</tspan></text>`,
  ].join('\n  ');
}

function monogramVC({
  x,
  y,
  size,
  fill = TOKENS.colors.ink,
  accentFill = TOKENS.colors.accent,
  weight = TOKENS.weights.bold,
  letterSpacing = '-0.06em',
}) {
  return `<text x="${x}" y="${y}" font-family="${TOKENS.font}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}" fill="${fill}">VC<tspan fill="${accentFill}">.</tspan></text>`;
}

function sloganTwoLines({
  x,
  y1,
  y2,
  size,
  fill = TOKENS.colors.ink,
  accentFill = TOKENS.colors.accent,
  weight = TOKENS.weights.regular,
  letterSpacing = TOKENS.letterSpacing.slogan,
}) {
  const attrs = `font-family="${TOKENS.font}" font-weight="${weight}" font-size="${size}" letter-spacing="${letterSpacing}" fill="${fill}"`;
  return [
    `<text x="${x}" y="${y1}" ${attrs}>AI, Autonomous Agents <tspan fill="${accentFill}">&amp;</tspan> Data Analytics.</text>`,
    `<text x="${x}" y="${y2}" ${attrs}>Cloud or On-Premises<tspan fill="${accentFill}">.</tspan></text>`,
  ].join('\n  ');
}

function urlMark({
  x,
  y,
  size,
  fill = TOKENS.colors.muted,
  weight = TOKENS.weights.medium,
  letterSpacing = TOKENS.letterSpacing.micro,
}) {
  return `<text x="${x}" y="${y}" font-family="${TOKENS.font}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}" fill="${fill}">VOGLER-CONSULTING.CH</text>`;
}

/* Measuring and fitting --------------------------------------------------- */

const PROBE = { width: 8000, height: 4000 };

/**
 * Render the body on an oversized canvas and read back the bounding box of
 * everything that actually got drawn, in user units. Nothing else here needs
 * to know how wide a string of Inter at 62px is.
 */
async function measureInk(body) {
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PROBE.width} ${PROBE.height}">
  <rect width="${PROBE.width}" height="${PROBE.height}" fill="#ffffff"/>
  ${body}
</svg>`;

  const { info } = await sharp(Buffer.from(probe), { density: 72 })
    .flatten({ background: '#ffffff' })
    .trim({ threshold: 8 })
    .toBuffer({ resolveWithObject: true });

  if (info.width >= PROBE.width || info.height >= PROBE.height) {
    throw new Error('content overflowed the probe canvas; raise PROBE');
  }

  return {
    x: -info.trimOffsetLeft,
    y: -info.trimOffsetTop,
    width: info.width,
    height: info.height,
  };
}

/**
 * A viewBox containing the ink plus its clear space, grown to the output's
 * aspect ratio and centred. `padLeft` biases the content sideways, which is
 * what a LinkedIn profile banner needs: the left of that image sits under the
 * profile photo on desktop.
 */
function fitViewBox(ink, { aspect, pad, padLeft = pad, circleSafe = false }) {
  let x = ink.x - padLeft;
  let y = ink.y - pad;
  let width = ink.width + padLeft + pad;
  let height = ink.height + pad * 2;

  if (circleSafe) {
    // Every platform masks an avatar to a circle, so the mark has to fit
    // inside the inscribed circle with room to spare, not merely inside the
    // square. 0.78 of the diameter is the usual safe fraction.
    const needed = Math.hypot(ink.width, ink.height) / 0.78;
    width = Math.max(width, needed);
    height = Math.max(height, needed);
    x = ink.x + ink.width / 2 - width / 2;
    y = ink.y + ink.height / 2 - height / 2;
  }

  if (width / height < aspect) {
    const grown = height * aspect;
    x -= (grown - width) / 2;
    width = grown;
  } else {
    const grown = width / aspect;
    y -= (grown - height) / 2;
    height = grown;
  }

  return { x, y, width, height };
}

/* Assets ------------------------------------------------------------------ */

const ASSETS = {
  'logo-wordmark-stacked': {
    out: { width: 400, height: 400 },
    pad: 34,
    bg: TOKENS.colors.paper,
    body: wordmarkStacked({ x: 40, y1: 200, y2: 259, size: 62 }),
  },
  'logo-wordmark-stacked-padded': {
    out: { width: 800, height: 800 },
    pad: 110,
    bg: TOKENS.colors.paper,
    body: wordmarkStacked({ x: 200, y1: 400, y2: 459, size: 62 }),
  },
  'logo-wordmark-stacked-landscape': {
    out: { width: 920, height: 260 },
    pad: 20,
    bg: null,
    body: wordmarkStacked({ x: 40, y1: 200, y2: 259, size: 62 }),
  },
  'logo-monogram-vc': {
    out: { width: 400, height: 400 },
    pad: 60,
    bg: TOKENS.colors.paper,
    body: monogramVC({ x: 200, y: 400, size: 240 }),
  },
  'avatar-monogram': {
    out: { width: 800, height: 800 },
    pad: 60,
    circleSafe: true,
    bg: TOKENS.colors.paper,
    body: monogramVC({ x: 200, y: 400, size: 240 }),
  },
  'avatar-monogram-small': {
    out: { width: 400, height: 400 },
    pad: 60,
    circleSafe: true,
    bg: TOKENS.colors.paper,
    body: monogramVC({ x: 200, y: 400, size: 240 }),
  },
  'avatar-wordmark': {
    out: { width: 800, height: 800 },
    pad: 40,
    circleSafe: true,
    bg: TOKENS.colors.paper,
    body: wordmarkStacked({ x: 40, y1: 200, y2: 259, size: 62 }),
  },
  'banner-slogan': {
    out: { width: 1128, height: 191 },
    pad: 46,
    bg: TOKENS.colors.paper,
    body: sloganTwoLines({
      x: 160,
      y1: 93,
      y2: 131,
      size: 28,
      letterSpacing: TOKENS.letterSpacing.sloganLarge,
    }),
  },
  'banner-linkedin-profile': {
    // LinkedIn's personal profile background, which is a different image and a
    // different shape from the company page cover. The left of it disappears
    // under the profile photo on desktop, so the content is pushed right.
    out: { width: 1584, height: 396 },
    pad: 90,
    padLeft: 520,
    bg: TOKENS.colors.paper,
    body: [
      wordmarkStacked({
        x: 160,
        y1: 100,
        y2: 152,
        size: 44,
        letterSpacing: TOKENS.letterSpacing.wordmarkBanner,
      }),
      sloganTwoLines({ x: 160, y1: 210, y2: 244, size: 24 }),
      urlMark({ x: 160, y: 292, size: 14 }),
    ].join('\n  '),
  },
  'banner-wordmark-slogan': {
    out: { width: 2400, height: 600 },
    pad: 120,
    bg: TOKENS.colors.paper,
    body: [
      wordmarkStacked({
        x: 640,
        y1: 280,
        y2: 332,
        size: 44,
        letterSpacing: TOKENS.letterSpacing.wordmarkBanner,
      }),
      sloganTwoLines({ x: 1280, y1: 280, y2: 314, size: 24 }),
      urlMark({ x: 1280, y: 360, size: 14 }),
    ].join('\n  '),
  },
  'banner-wordmark-slogan-tight': {
    out: { width: 700, height: 170 },
    pad: 18,
    bg: TOKENS.colors.paper,
    body: [
      wordmarkStacked({
        x: 20,
        y1: 63,
        y2: 103,
        size: 28,
        letterSpacing: TOKENS.letterSpacing.wordmarkBanner,
      }),
      sloganTwoLines({ x: 320, y1: 63, y2: 88, size: 18 }),
      urlMark({ x: 320, y: 135, size: 11 }),
    ].join('\n  '),
  },
};

/* Build ------------------------------------------------------------------- */

/**
 * Prove that Inter resolves before anything is written. Two weights of the
 * same string render to different widths in Inter and to the same width in the
 * fallback, so this catches a substituted font, which is otherwise invisible
 * until someone compares an exported logo against the website.
 */
async function assertFontAvailable() {
  const width = async (weight) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 400"><rect width="4000" height="400" fill="#ffffff"/><text x="20" y="200" font-family="${TOKENS.font}" font-weight="${weight}" font-size="62" letter-spacing="-0.06em" fill="#000000">CONSULTING.</text></svg>`;
    const { info } = await sharp(Buffer.from(svg), { density: 72 })
      .flatten({ background: '#ffffff' })
      .trim({ threshold: 8 })
      .toBuffer({ resolveWithObject: true });
    return info.width;
  };

  if ((await width(400)) === (await width(700))) {
    throw new Error(
      `${TOKENS.font} is not available to the renderer, so the wordmark would be ` +
        'exported in a substituted typeface. Install Inter system-wide ' +
        '(https://rsms.me/inter/) and run pnpm brand again.',
    );
  }
}

async function buildAsset(name, asset) {
  const ink = await measureInk(asset.body);
  const box = fitViewBox(ink, {
    aspect: asset.out.width / asset.out.height,
    pad: asset.pad,
    padLeft: asset.padLeft ?? asset.pad,
    circleSafe: asset.circleSafe ?? false,
  });

  const round = (value) => Number(value.toFixed(2));
  const viewBox = [box.x, box.y, box.width, box.height].map(round).join(' ');
  const background = asset.bg
    ? `\n  <rect x="${round(box.x)}" y="${round(box.y)}" width="${round(box.width)}" height="${round(box.height)}" fill="${asset.bg}"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${asset.out.width}" height="${asset.out.height}">${background}
  ${asset.body}
</svg>\n`;

  await writeFile(join(OUT_DIR, `${name}.svg`), svg);
  const png = await sharp(Buffer.from(svg), { density: 300 })
    .resize(asset.out.width, asset.out.height)
    .png({ quality: 95 })
    .toBuffer();
  await writeFile(join(OUT_DIR, `${name}.png`), png);

  console.log(
    `${name.padEnd(32)} ${asset.out.width}x${asset.out.height}  ${(png.byteLength / 1024).toFixed(1)} kB`,
  );
}

await assertFontAvailable();
await mkdir(OUT_DIR, { recursive: true });
for (const [name, asset] of Object.entries(ASSETS)) {
  await buildAsset(name, asset);
}
