
/**
 * Song Downloader - Download audio from YouTube
 */

const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const APIs = require('../../utils/api');
const { toAudio } = require('../../utils/converter');
const config = require('../../config');

const CHANNEL_URL =
  'https://whatsapp.com/channel/0029VbC1954K5cD7bldE210V';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const AXIOS_DEFAULTS = {
  timeout: 60000,
  headers: {
    'User-Agent': UA,
    Accept: 'application/json, text/plain, */*',
  },
};

const YT_API = config.mediaApiUrl;
const YT_API_KEY = config.mediaApiKey;
const PRINCE_API = String(
  config.princeApiUrl || 'https://api.princetechn.com'
).replace(/\/$/, '');
const PRINCE_API_KEY = config.princeApiKey || 'prince';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickUrl(result) {
  const url = result?.download || result?.dl_url || result?.dl;
  return url && /^https?:\/\//i.test(url) ? url : null;
}

function isIpLockedCdn(url) {
  return /googlevideo\.com|youtube\.com\/videoplayback/i.test(
    String(url || '')
  );
}

function extractYouTubeId(input) {
  const text = String(input || '').trim();

  const patterns = [
    /(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

async function resolveVideoInfo(text) {
  if (/youtube\.com|youtu\.be/i.test(text)) {
    const videoId = extractYouTubeId(text);

    if (videoId) {
      try {
        const info = await yts({ videoId });

        if (info?.videoId || info?.url) {
          return {
            url: info.url || `https://www.youtube.com/watch?v=${videoId}`,
            title: info.title || 'YouTube Audio',
            thumbnail: info.thumbnail || info.image || null,
            timestamp:
              info.timestamp || info.duration?.timestamp || '—',
          };
        }
      } catch (err) {
        console.log(
          '[song] yts videoId lookup failed:',
          err?.message || err
        );
      }
    }

    return {
      url: text.trim(),
      title: 'YouTube Audio',
      thumbnail: null,
      timestamp: '—',
    };
  }

  const search = await yts(text);

  if (!search || !search.videos?.length) return null;

  return search.videos[0];
}

function toYouTubeWatchUrl(input) {
  const id = extractYouTubeId(input);

  return id
    ? `https://youtu.be/${id}`
    : String(input || '').trim();
}

// Prince API
async function princeSongDownload(url, attempts = 2) {
  const watchUrl = toYouTubeWatchUrl(url);
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const endpoint = new URL('/api/download/ytmp3', PRINCE_API);

      endpoint.searchParams.set('apikey', PRINCE_API_KEY);
      endpoint.searchParams.set('url', watchUrl);

      const { data, status } = await axios.get(endpoint.toString(), {
        timeout: 120000,
        validateStatus: () => true,
        headers: {
          Accept: 'application/json',
          'User-Agent': UA,
        },
      });

      if (status >= 400 || data?.success === false) {
        throw new Error(
          data?.message ||
          data?.error ||
          `Prince API HTTP ${status}`
        );
      }

      const result = data?.result || data;
      const download = result?.downloadUrl || pickUrl(result);

      if (!download) {
        throw new Error('Prince API returned no download URL');
      }

      return {
        download,
        title: result?.title,
        thumbnail: result?.thumbnail || null,
      };
    } catch (err) {
      lastError = err;

      console.log(
        `[song] Prince attempt ${attempt}/${attempts}:`,
        err.message,
        watchUrl
      );

      if (attempt < attempts) await sleep(1200 * attempt);
    }
  }

  throw lastError || new Error('Prince API failed');
}

// Hector API
const HECTOR_API =
  'https://yt-dl.officialhectormanuel.workers.dev';

async function hectorSongDownload(url, attempts = 2) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const { data, status } = await axios.get(HECTOR_API, {
        params: { url },
        timeout: 90000,
        validateStatus: () => true,
        headers: {
          Accept: 'application/json',
          'User-Agent': UA,
        },
      });

      if (status >= 400 || data?.status === false) {
        throw new Error(
          data?.message ||
          data?.error ||
          `Hector API HTTP ${status}`
        );
      }

      const download = data?.audio;

      if (!download || !/^https?:\/\//i.test(download)) {
        throw new Error('Hector API returned no audio URL');
      }

      return {
        download,
        title: data?.title,
        thumbnail: data?.thumbnail || null,
      };
    } catch (err) {
      lastError = err;

      console.log(
        `[song] Hector attempt ${attempt}/${attempts}:`,
        err.message
      );

      if (attempt < attempts) await sleep(1200 * attempt);
    }
  }

  throw lastError || new Error('Hector API failed');
}

// Knight API
async function knightSongDownload(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const { data, status } = await axios.get(
        `${YT_API}/api/download/ytaudio`,
        {
          params: {
            apikey: YT_API_KEY,
            format: '128kbps',
            url,
          },
          timeout: 180000,
          validateStatus: () => true,
          headers: {
            Accept: 'application/json',
            'User-Agent': UA,
          },
        }
      );

      if (status >= 500 || !data?.success) {
        const message =
          data?.result?.error ||
          data?.error ||
          data?.message ||
          `Knight API HTTP ${status}`;

        throw new Error(message);
      }

      const result = data.result || data;
      const download = pickUrl(result);

      if (!download) {
        throw new Error('Knight API returned no download URL');
      }

      return {
        download,
        title: result?.title,
        thumbnail: result?.thumbnail || null,
      };
    } catch (err) {
      lastError = err;

      console.log(
        `[song] Knight attempt ${attempt}/${attempts}:`,
        err.message
      );

      if (attempt < attempts) await sleep(1500 * attempt);
    }
  }

  throw lastError || new Error('Knight API failed');
}

// Prexzy API
async function prexzySongDownload(url) {
  const { data } = await axios.get(
    'https://prexzyapis.com/download/ytmp3',
    {
      params: { url },
      timeout: 90000,
      headers: AXIOS_DEFAULTS.headers,
    }
  );

  if (!data?.status || !data?.download_url) {
    throw new Error(
      data?.message ||
      data?.error ||
      'Prexzy ytmp3 returned no download_url'
    );
  }

  if (isIpLockedCdn(data.download_url)) {
    throw new Error(
      'Prexzy returned IP-locked googlevideo URL (403 for bots)'
    );
  }

  const info = data.info || {};

  return {
    download: data.download_url,
    title: info.title || null,
    thumbnail: info.thumbnail || null,
    referer: 'https://www.youtube.com/',
  };
}

// Fetch audio
async function fetchAudioBuffer(audioUrl, headers, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        decompress: true,
        validateStatus: (status) =>
          status >= 200 && status < 400,
        headers,
      });

      const buffer = Buffer.from(response.data);

      if (buffer.length > 0) return buffer;

      throw new Error('Empty audio buffer');
    } catch (err) {
      lastError = err;

      const status = err.response?.status;

      if (status === 403 || status === 451) throw err;

      console.log(
        `[song] file fetch attempt ${attempt}/${attempts}:`,
        status || err.code || err.message
      );

      if (attempt < attempts) await sleep(1200 * attempt);
    }
  }

  throw lastError || new Error('Failed to fetch audio file');
}

// Detect audio format
function detectAudioFormat(buffer) {
  if (!buffer || buffer.length < 12) return null;

  if (buffer.toString('ascii', 4, 8) === 'ftyp') {
    return { name: 'M4A/MP4', ext: 'm4a' };
  }

  if (
    buffer.toString('ascii', 0, 3) === 'ID3' ||
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
  ) {
    return { name: 'MP3', ext: 'mp3' };
  }

  if (buffer.toString('ascii', 0, 4) === 'OggS') {
    return { name: 'OGG/Opus', ext: 'ogg' };
  }

  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    return { name: 'WAV', ext: 'wav' };
  }

  if (buffer.readUInt32BE(0) === 0x1a45dfa3) {
    return { name: 'WebM', ext: 'webm' };
  }

  return null;
}

module.exports = {
  name: 'song',
  aliases: ['play', 'music', 'yta'],
  category: 'media',
  description: 'Download audio from YouTube',
  usage: '.play <song name or YouTube link>',

  async execute(sock, msg, args) {
    try {
      const text = args.join(' ').trim();
      const chatId = msg.key.remoteJid;

      if (!text) {
        return await sock.sendMessage(
          chatId,
          {
            text:
              `Usage: ${config.prefix}play <song name or YouTube link>\n\n` +
              `📢 Channel: ${CHANNEL_URL}`,
          },
          { quoted: msg }
        );
      }

      const video = await resolveVideoInfo(text);

      if (!video?.url) {
        return await sock.sendMessage(
          chatId,
          { text: 'No results found.' },
          { quoted: msg }
        );
      }

      const caption =
        `🎵 Downloading: *${video.title || 'YouTube Audio'}*\n` +
        `⏱ Duration: ${video.timestamp || '—'}\n\n` +
        `📢 WhatsApp Channel:\n${CHANNEL_URL}`;

      // Channel link preview context
      const contextInfo = {
        externalAdReply: {
          title: config.botName || 'Music Bot',
          body: 'Follow Our WhatsApp Channel',
          mediaType: 1,
          sourceUrl: CHANNEL_URL,
          renderLargerThumbnail: false,
        },
      };

      if (
        video.thumbnail &&
        /^https?:\/\//i.test(video.thumbnail)
      ) {
        await sock.sendMessage(
          chatId,
          {
            image: { url: video.thumbnail },
            caption,
            contextInfo,
          },
          { quoted: msg }
        );
      } else {
        await sock.sendMessage(
          chatId,
          {
            text: caption,
            contextInfo,
          },
          { quoted: msg }
        );
      }

      let audioData;
      let audioBuffer;
      let downloadSuccess = false;

      // Try APIs in sequence, falling back when one fails
      const apiMethods = [
        {
          name: 'Hector',
          method: () => hectorSongDownload(video.url),
        },
        {
          name: 'Knight API',
          method: () => knightSongDownload(video.url),
        },
        {
          name: 'Prince API',
          method: () => princeSongDownload(video.url),
        },
        {
          name: 'Prexzy',
          method: () => prexzySongDownload(video.url),
        },
        {
          name: 'EliteProTech',
          method: () =>
            APIs.getEliteProTechDownloadByUrl(video.url),
        },
        {
          name: 'Yupra',
          method: () => APIs.getYupraDownloadByUrl(video.url),
        },
        {
          name: 'Okatsu',
          method: () => APIs.getOkatsuDownloadByUrl(video.url),
        },
        {
          name: 'Izumi',
          method: () => APIs.getIzumiDownloadByUrl(video.url),
        },
      ];

      for (const apiMethod of apiMethods) {
        try {
          audioData = await apiMethod.method();

          const audioUrl =
            audioData?.download ||
            audioData?.audio ||
            audioData?.downloadUrl ||
            audioData?.dl ||
            audioData?.url;

          if (!audioUrl) {
            console.log(
              `${apiMethod.name} returned no download URL, trying next API...`
            );
            continue;
          }

          if (isIpLockedCdn(audioUrl)) {
            console.log(
              `${apiMethod.name} gave IP-locked CDN URL, trying next API...`
            );
            continue;
          }

          const downloadHeaders = {
            'User-Agent': UA,
            Accept: '*/*',
            'Accept-Encoding': 'identity',
          };

          if (audioData.referer) {
            downloadHeaders.Referer = audioData.referer;
          }

          try {
            audioBuffer = await fetchAudioBuffer(
              audioUrl,
              downloadHeaders
            );

            if (audioBuffer?.length) {
              if (!detectAudioFormat(audioBuffer)) {
                const head = audioBuffer
                  .slice(0, 60)
                  .toString('utf8')
                  .replace(/\s+/g, ' ');

                console.log(
                  `${apiMethod.name} returned non-audio ` +
                  `(${audioBuffer.length} bytes): ${head}`
                );

                audioBuffer = null;
                continue;
              }

              downloadSuccess = true;

              console.log(
                `[song] OK via ${apiMethod.name} ` +
                `(${audioBuffer.length} bytes)`
              );

              break;
            }
          } catch (downloadErr) {
            const statusCode =
              downloadErr.response?.status ||
              downloadErr.status;

            console.log(
              `Download failed from ${apiMethod.name}:`,
              statusCode ||
              downloadErr.code ||
              downloadErr.message
            );

            continue;
          }
        } catch (apiErr) {
          console.log(
            `${apiMethod.name} API failed:`,
            apiErr.message
          );

          continue;
        }
      }

      if (!downloadSuccess || !audioBuffer) {
        throw new Error(
          'All download sources failed. Knight API needs fresh YouTube cookies on Render (cookies.txt).'
        );
      }

      if (audioBuffer.length === 0) {
        throw new Error('Downloaded audio buffer is empty');
      }

      const detected = detectAudioFormat(audioBuffer);

      if (!detected) {
        throw new Error('Downloaded file is not a recognized audio format');
      }

      const { name: detectedFormat, ext: fileExtension } = detected;

      let finalBuffer = audioBuffer;
      let finalMimetype = 'audio/mpeg';
      let finalExtension = 'mp3';

      if (fileExtension !== 'mp3') {
        try {
          finalBuffer = await toAudio(
            audioBuffer,
            fileExtension
          );

          if (!finalBuffer || finalBuffer.length === 0) {
            throw new Error('Conversion returned empty buffer');
          }
        } catch (convErr) {
          throw new Error(
            `Failed to convert ${detectedFormat} to MP3: ` +
            `${convErr?.message || convErr}`
          );
        }
      }

      const safeTitle = String(
        audioData?.title || video.title || 'song'
      ).replace(/[^\w\s-]/g, '').trim() || 'song';

      await sock.sendMessage(
        chatId,
        {
          audio: finalBuffer,
          mimetype: finalMimetype,
          fileName: `${safeTitle}.${finalExtension}`,
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: config.botName || 'Music Bot',
              body: 'Follow Our WhatsApp Channel',
              mediaType: 1,
              sourceUrl: CHANNEL_URL,
              renderLargerThumbnail: false,
            },
          },
        },
        { quoted: msg }
      );

      // Clean up old temporary audio files
      try {
        const tempDir = path.join(__dirname, '../../temp');

        if (fs.existsSync(tempDir)) {
          const files = fs.readdirSync(tempDir);
          const now = Date.now();

          files.forEach((file) => {
            const filePath = path.join(tempDir, file);

            try {
              const stats = fs.statSync(filePath);

              if (now - stats.mtimeMs > 10000) {
                if (
                  file.endsWith('.mp3') ||
                  file.endsWith('.m4a') ||
                  /^\d+\.(mp3|m4a)$/.test(file)
                ) {
                  fs.unlinkSync(filePath);
                }
              }
            } catch (e) {}
          });
        }
      } catch (cleanupErr) {}
    } catch (err) {
      console.error('Song command error:', err);

      let errorMessage = '❌ Failed to download song.';

      if (err.message?.includes('cookies')) {
        errorMessage =
          '❌ YouTube blocked the download API. Update cookies.txt on the Knight API host and redeploy.';
      } else if (err.message?.includes('blocked')) {
        errorMessage =
          '❌ Download blocked. The content may be unavailable in your region or due to legal restrictions.';
      } else if (
        err.response?.status === 451 ||
        err.status === 451
      ) {
        errorMessage =
          '❌ Content unavailable (451). This may be due to legal restrictions or regional blocking.';
      } else if (
        err.message?.includes('All download sources failed')
      ) {
        errorMessage =
          '❌ All download sources failed. Knight API needs fresh YouTube cookies on Render.';
      }

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: `${errorMessage}\n\n📢 WhatsApp Channel:\n${CHANNEL_URL}`,
        },
        { quoted: msg }
      );
    }
  },
};
