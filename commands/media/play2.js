const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const yts = require('yt-search');
const config = require('../../config');

const BIN_NAME = process.platform === 'win32' ? 'tubepull.cmd' : 'tubepull';
const PROXY_KEYS = [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'ALL_PROXY',
  'http_proxy',
  'https_proxy',
  'all_proxy',
];

function sanitizeName(value) {
  return (value || 'audio')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'audio';
}

function extractYouTubeId(input) {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || null;
    if (host.endsWith('youtube.com')) return url.searchParams.get('v');
    return null;
  } catch {
    return null;
  }
}

function isYouTubeUrl(input) {
  return Boolean(extractYouTubeId(input));
}

function stripProxyEnv(env) {
  const next = { ...env };
  PROXY_KEYS.forEach((key) => delete next[key]);
  return next;
}

function createCliError(code, stderr, stdout) {
  const text = [stderr, stdout].filter(Boolean).join('\n').trim();
  const err = new Error(text || `tubepull exited with code ${code}`);
  err.code = code;
  err.stderr = stderr;
  err.stdout = stdout;
  return err;
}

function resolveTubepullCommand() {
  const localBin = path.resolve(__dirname, '../../node_modules/.bin', BIN_NAME);
  if (fs.existsSync(localBin)) {
    return { command: localBin, prefixArgs: [] };
  }

  try {
    const pkgPath = require.resolve('tubepull/package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.tubepull;
    if (binRel) {
      const cliPath = path.resolve(path.dirname(pkgPath), binRel);
      if (fs.existsSync(cliPath)) {
        return { command: process.execPath, prefixArgs: [cliPath] };
      }
    }
  } catch {}

  return { command: 'tubepull', prefixArgs: [] };
}

function runTubepull(url, outputDir, fileBase, { stripProxy = false } = {}) {
  return new Promise((resolve, reject) => {
    const execInfo = resolveTubepullCommand();

    const args = [
      ...execInfo.prefixArgs,
      url,
      '--audio',
      '--format',
      'mp3',
      '--output',
      outputDir,
      '--filename',
      fileBase,
      '--yes',
    ];

    const child = spawn(execInfo.command, args, {
      env: stripProxy ? stripProxyEnv(process.env) : { ...process.env },
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr, stripProxy });
      else reject(createCliError(code, stderr, stdout));
    });
  });
}

async function downloadWithFallback(url, outputDir, fileBase) {
  try {
    return await runTubepull(url, outputDir, fileBase);
  } catch (error) {
    const message = `${error?.message || ''}\n${error?.stderr || ''}`;
    if (/Failed to parse URL from \[object Request\]/i.test(message)) {
      return runTubepull(url, outputDir, fileBase, { stripProxy: true });
    }
    throw error;
  }
}

function pickDownloadedFile(outputDir) {
  const files = fs.readdirSync(outputDir)
    .filter((file) => file.toLowerCase().endsWith('.mp3'))
    .sort();

  if (!files.length) {
    throw new Error('tubepull did not produce an MP3 file');
  }

  return path.join(outputDir, files[0]);
}

function formatDuration(seconds) {
  if (!seconds || Number.isNaN(Number(seconds))) return null;
  const total = Number(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return h > 0
    ? [h, m.toString().padStart(2, '0'), s.toString().padStart(2, '0')].join(':')
    : [m, s.toString().padStart(2, '0')].join(':');
}

async function resolveTarget(query) {
  if (isYouTubeUrl(query)) {
    const videoId = extractYouTubeId(query);
    return {
      url: query,
      title: 'YouTube Audio',
      thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null,
      timestamp: null,
    };
  }

  const search = await yts(query);
  const video = search?.videos?.[0];
  if (!video?.url) {
    throw new Error('No YouTube results found');
  }

  return {
    url: video.url,
    title: video.title || 'YouTube Audio',
    thumbnail: video.thumbnail,
    timestamp: video.timestamp || formatDuration(video.seconds),
  };
}

function buildUserError(error) {
  const message = error?.message || 'Unknown error';

  if (/ENOENT|not found/i.test(message) && /tubepull/i.test(message)) {
    return '❌ `tubepull` install nahi hai ya server par dependencies proper install nahi hui. `npm install` ya `npm install tubepull` chalao.';
  }

  if (/node.*22\.12|requires >= 22\.12/i.test(message)) {
    return '❌ `tubepull` ko Node 22.12+ chahiye.';
  }

  if (/Failed to parse URL from \[object Request\]/i.test(message)) {
    return '❌ `tubepull` proxy env ke saath fail ho raha hai. Server par proxy config check karo ya package update karo.';
  }

  if (/fetch failed|unreachable|Network request failed/i.test(message)) {
    return '❌ Server se YouTube reach nahi ho raha. Network, proxy ya firewall check karo.';
  }

  if (/No YouTube results found/i.test(message)) {
    return '❌ Koi result nahi mila. Dusra keyword try karo.';
  }

  return `❌ Download failed: ${message}`;
}

module.exports = {
  name: 'play2',
  aliases: ['tpplay', 'tubepullplay'],
  category: 'media',
  description: 'Download YouTube audio with tubepull',
  usage: '.play2 <song name or YouTube link>',

  async execute(sock, msg, args, extra) {
    const chatId = extra?.from || msg.key.remoteJid;
    const reply = extra?.reply
      || ((text) => sock.sendMessage(chatId, { text }, { quoted: msg }));
    const react = async (emoji) => {
      try {
        await sock.sendMessage(chatId, { react: { text: emoji, key: msg.key } });
      } catch {}
    };

    const query = args.join(' ').trim();
    if (!query) {
      return reply('Usage: `.play2 <song name or YouTube link>`');
    }

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const outputDir = path.join(os.tmpdir(), `play2-${stamp}`);

    try {
      await react('🎵');

      const target = await resolveTarget(query);
      const previewTitle = sanitizeName(target.title || 'YouTube Audio');
      const previewText = [
        `🎵 Downloading: *${previewTitle}*`,
        target.timestamp ? `⏱ Duration: ${target.timestamp}` : null,
        `> *_Powered by ${config.botName} + tubepull_*`,
      ].filter(Boolean).join('\n');

      if (target.thumbnail && /^https?:\/\//i.test(target.thumbnail)) {
        try {
          await sock.sendMessage(chatId, {
            image: { url: target.thumbnail },
            caption: previewText,
          }, { quoted: msg });
        } catch {
          await reply(previewText);
        }
      } else {
        await reply(previewText);
      }

      fs.mkdirSync(outputDir, { recursive: true });
      const result = await downloadWithFallback(target.url, outputDir, `play2-${stamp}`);
      const audioPath = pickDownloadedFile(outputDir);
      const audioBuffer = fs.readFileSync(audioPath);
      const fileName = `${previewTitle}.mp3`;

      await sock.sendMessage(chatId, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName,
        ptt: false,
      }, { quoted: msg });

      if (result.stripProxy) {
        await reply('ℹ️ Proxy env hata kar fallback use hua. Agar server proxy ke peeche hai to `tubepull` update ya custom network setup consider karo.');
      }

      await react('✅');
    } catch (error) {
      console.error('[play2]', error);
      await react('❌');
      await reply(buildUserError(error));
    } finally {
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
      }
    }
  },
};
