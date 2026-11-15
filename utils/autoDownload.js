'use strict';

/**
 * AutoDownload - detect social media links in a message and hand them off to
 * the existing downloader commands. No prefix / command required.
 */

const config = require('../config');

// Supported platforms -> downloader command name (must exist in the registry)
const PLATFORMS = [
  { platform: 'instagram', command: 'instagram', test: /(?:instagram\.com|instagr\.am)\//i },
  { platform: 'tiktok', command: 'tiktok', test: /(?:tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)\//i },
  { platform: 'pinterest', command: 'pinterest', test: /(?:pinterest\.[a-z.]+|pin\.it)\//i },
  { platform: 'facebook', command: 'facebook', test: /(?:facebook\.com|fb\.com|fb\.watch)\//i },
  { platform: 'twitter', command: 'twitter', test: /(?:twitter\.com|x\.com)\//i },
];

const KNOWN_DOMAINS =
  'instagram\\.com|instagr\\.am|tiktok\\.com|vt\\.tiktok\\.com|vm\\.tiktok\\.com|' +
  'pin\\.it|pinterest\\.[a-z.]+|facebook\\.com|fb\\.com|fb\\.watch|twitter\\.com|x\\.com';

const FULL_URL_RE = /https?:\/\/[^\s<>"')\]}]+/i;
const BARE_URL_RE = new RegExp(
  `(?:^|[\\s(])((?:www\\.)?(?:${KNOWN_DOMAINS})/[^\\s<>"')\\]}]*)`,
  'i'
);

function findUrl(text) {
  const s = String(text || '');
  const full = s.match(FULL_URL_RE);
  if (full) return full[0];

  // Bare domain links (e.g. "tiktok.com/xxx") without a protocol
  const bare = s.match(BARE_URL_RE);
  return bare ? `https://${bare[1]}` : null;
}

function cleanUrl(url) {
  return String(url).replace(/[.,;:!?)\]}'"]+$/, '');
}

/**
 * @param {string} text message body
 * @returns {{platform: string, command: string, url: string}|null}
 */
function detectMediaLink(text) {
  const raw = findUrl(text);
  if (!raw) return null;

  const url = cleanUrl(raw);
  for (const p of PLATFORMS) {
    if (p.test.test(url)) return { platform: p.platform, command: p.command, url };
  }
  return null;
}

/**
 * Group setting `autodownload` (boolean) overrides the global config switch.
 */
function isEnabled(groupSettings) {
  const override = groupSettings?.autodownload;
  if (typeof override === 'boolean') return override;
  return !!config.autoDownload;
}

/**
 * Run the matching downloader command for a detected link.
 * @returns {boolean} true when a downloader handled the message
 */
async function run(sock, msg, ctx, match) {
  const command = ctx.commands?.get(match.command);
  if (!command?.execute) return false;

  const reply = (text) => sock.sendMessage(ctx.from, { text }, { quoted: msg });
  const react = (emoji) => sock.sendMessage(ctx.from, { react: { text: emoji, key: msg.key } });

  const extra = {
    from: ctx.from,
    sender: ctx.sender,
    isGroup: ctx.isGroup,
    groupMetadata: ctx.groupMetadata,
    pushName: msg.pushName,
    commandName: match.command,
    isOwner: ctx.isOwner,
    isAdmin: ctx.isAdmin,
    isBotAdmin: ctx.isBotAdmin,
    isMod: ctx.isMod,
    reply,
    react,
  };

  // Downloader commands read the link from the message text; give them a clean copy
  const urlMsg = { ...msg, message: { conversation: match.url } };

  await command.execute(sock, urlMsg, [match.url], extra);
  return true;
}

module.exports = { PLATFORMS, detectMediaLink, isEnabled, run };
