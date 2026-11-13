/**
 * Fast .tgs → animated WebP (lottie-web + [canvas|svg+sharp] + ffmpeg)
 * Works with modern lottie-web (5.13+) which UMD-exports to module.exports.
 *
 * Two render paths (auto-selected):
 *   1. canvas  — original, fastest. Used when `canvas` native module loads.
 *   2. svg     — fallback for panels where `canvas.node` is missing.
 *                lottie-web renders each frame to inline <svg> in jsdom,
 *                `sharp` rasterizes the SVG → PNG, ffmpeg muxes to animated WebP.
 *
 * Optimizations:
 * - cache lottie-web module (no per-sticker disk read + eval)
 * - pipe PNG frames to ffmpeg stdin (no per-frame disk I/O)
 */

const fs = require('fs');
const pako = require('pako');
const { JSDOM } = require('jsdom');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

/* --------------------------- optional natives --------------------------- */
let Canvas = null;
try {
  ({ Canvas } = require('canvas'));
} catch (e) {
  console.warn('[tgsToWebp] canvas module not available — using SVG+sharp fallback for TGS.');
}

let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('[tgsToWebp] sharp module not available.');
}

/* ------------------------------ helpers ------------------------------ */
const tick = () => new Promise((r) => setImmediate(r));

/** pako v2 returns string with {to:'string'}; v3 always returns Uint8Array */
function inflateToString(buf) {
  const out = pako.inflate(buf);
  return out instanceof Uint8Array ? Buffer.from(out).toString('utf8') : out;
}

/** Serialize — canvas/lottie is not safe concurrently */
let tgsQueue = Promise.resolve();
function withTgsLock(fn) {
  const run = tgsQueue.then(fn, fn);
  tgsQueue = run.then(
    () => {},
    () => {}
  );
  return run;
}

/** Load lottie-web once — re-eval per sticker kills weak panels (canvas path) */
let cachedLottie = null;
function getLottie() {
  if (cachedLottie) return cachedLottie;

  const lottiePath = require.resolve('lottie-web/build/player/lottie.js');
  const { window } = new JSDOM('', { pretendToBeVisual: true });
  const { document } = window;
  const createElement = document.createElement.bind(document);
  document.createElement = (localName) =>
    localName === 'canvas' ? new Canvas() : createElement(localName);

  const src = fs.readFileSync(lottiePath, 'utf8');
  const module = { exports: {} };
  const exports = module.exports;
  // eslint-disable-next-line no-eval
  eval(src);

  cachedLottie = module.exports;
  if (!cachedLottie || typeof cachedLottie.loadAnimation !== 'function') {
    throw new Error('lottie-web failed to expose loadAnimation (check lottie-web install)');
  }
  return cachedLottie;
}

/** Create a fresh jsdom + lottie instance for the SVG renderer */
function createSvgLottie() {
  const lottiePath = require.resolve('lottie-web/build/player/lottie.js');
  const { window } = new JSDOM('', { pretendToBeVisual: true });
  const { document } = window;
  const container = document.createElement('div');
  document.body.appendChild(container);

  // lottie-web may probe canvas.getContext even in SVG mode (e.g. for text).
  // Provide a no-op 2D context so getContext() never returns null.
  const noop = () => {};
  const noopCtx = new Proxy({}, {
    get: () => (typeof noopCtx === 'function' ? noop : noop),
  });
  const origCreateElement = document.createElement.bind(document);
  document.createElement = (localName) => {
    const el = origCreateElement(localName);
    if (localName === 'canvas') {
      el.getContext = () => noopCtx;
    }
    return el;
  };

  const src = fs.readFileSync(lottiePath, 'utf8');
  const module = { exports: {} };
  const exports = module.exports;
  // eslint-disable-next-line no-eval
  eval(src);

  const lottie = module.exports;
  if (!lottie || typeof lottie.loadAnimation !== 'function') {
    throw new Error('lottie-web failed to expose loadAnimation (svg path)');
  }
  return { lottie, container };
}

const FFMPEG_WEBP_ARGS = (fps, outPath) => [
  '-y',
  '-f', 'image2pipe',
  '-vcodec', 'png',
  '-framerate', String(fps),
  '-i', 'pipe:0',
  '-c:v', 'libwebp',
  '-preset', 'default',
  '-loop', '0',
  '-vsync', '0',
  '-pix_fmt', 'yuva420p',
  '-auto-alt-ref', '0',
  '-quality', '75',
  '-compression_level', '6',
  outPath,
];

function spawnFfmpeg(fps, outPath) {
  const ff = spawn(ffmpegPath, FFMPEG_WEBP_ARGS(fps, outPath));
  const errBufs = [];
  ff.stderr.on('data', (d) => errBufs.push(d));
  const done = new Promise((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => {
      if (code === 0) return resolve();
      const full = Buffer.concat(errBufs).toString('utf8').replace(/\r/g, '');
      const lines = full.split('\n').map((l) => l.trim()).filter(Boolean);
      const useful = lines.filter((l) =>
        /error|invalid|failed|unknown|cannot|unsupported/i.test(l)
      );
      reject(
        new Error(
          (useful.length ? useful.slice(-3).join(' | ') : lines.slice(-5).join(' | ')).slice(-400)
          || `ffmpeg exit ${code}`
        )
      );
    });
  });
  return { ff, done };
}

/* ----------------------------- main entry ----------------------------- */
async function tgsToWebp(tgsBuffer, outPath, tempDir, tag) {
  if (Canvas) {
    return withTgsLock(() => tgsToWebpCanvas(tgsBuffer, outPath, tempDir, tag));
  }
  if (sharp) {
    return withTgsLock(() => tgsToWebpSvg(tgsBuffer, outPath, tempDir, tag));
  }
  throw new Error(
    'Neither canvas nor sharp is available on this server — cannot convert TGS animated stickers. ' +
    'Ask your host to install libcairo/pango build tools for canvas.'
  );
}

/* ----------------------------- CANVAS PATH ----------------------------- */
async function tgsToWebpCanvas(tgsBuffer, outPath, _tempDir, _tag) {
  const data = JSON.parse(inflateToString(tgsBuffer));
  const canvas = new Canvas(512, 512);
  const ctx = canvas.getContext('2d');
  const lottie = getLottie();
  const anim = lottie.loadAnimation({
    animationData: data,
    renderer: 'canvas',
    rendererSettings: { context: ctx, clearCanvas: true },
  });

  const srcFps = data.fr || 60;
  const fps = Math.min(15, srcFps);
  const step = Math.max(1, Math.round(srcFps / fps));

  const { ff, done: ffDone } = spawnFfmpeg(fps, outPath);

  let n = 0;
  try {
    ff.stdin.on('error', () => {}); // ignore EPIPE if ffmpeg exits early
    for (let i = data.ip | 0; i < (data.op | 0); i += step) {
      ctx.clearRect(0, 0, 512, 512);
      anim.goToAndStop(i, true);
      await tick();
      await tick();
      await tick();
      await tick(); // Lottie paints async — 4 ticks needed for reliable transparent frames
      const png = canvas.toBuffer('image/png');
      if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
      n++;
    }
  } finally {
    try { ff.stdin.end(); } catch { /* ignore */ }
    try { anim.destroy(); } catch { /* ignore */ }
  }

  if (n < 2) { ff.kill(); throw new Error('TGS rendered too few frames'); }
  await ffDone;
}

/* --------------------------- SVG + SHARP PATH --------------------------- */
async function tgsToWebpSvg(tgsBuffer, outPath, _tempDir, _tag) {
  const data = JSON.parse(inflateToString(tgsBuffer));
  const { lottie, container } = createSvgLottie();

  const anim = lottie.loadAnimation({
    container,
    animationData: data,
    renderer: 'svg',
    rendererSettings: { scale: 1, clearCanvas: true },
  });

  const srcFps = data.fr || 60;
  const fps = Math.min(15, srcFps);
  const step = Math.max(1, Math.round(srcFps / fps));

  const { ff, done: ffDone } = spawnFfmpeg(fps, outPath);

  let n = 0;
  try {
    ff.stdin.on('error', () => {});
    for (let i = data.ip | 0; i < (data.op | 0); i += step) {
      anim.goToAndStop(i, true);
      await tick();
      await tick();
      await tick();
      await tick();
      const svgEl = container.querySelector('svg');
      if (!svgEl) continue;
      let svgStr = svgEl.outerHTML;
      if (!/xmlns=/.test(svgStr)) {
        svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      // sharp rasterizes the SVG to a 512x512 PNG with transparent background
      const png = await sharp(Buffer.from(svgStr), { density: 300 })
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
      n++;
    }
  } finally {
    try { ff.stdin.end(); } catch { /* ignore */ }
    try { anim.destroy(); } catch { /* ignore */ }
  }

  if (n < 2) { ff.kill(); throw new Error('TGS rendered too few frames'); }
  await ffDone;
}

module.exports = { tgsToWebp };
