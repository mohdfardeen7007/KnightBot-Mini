const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const config = require('../config');
const { isNiceName, lookupName } = require('./nameCache');
const { normalizeJidWithLid, buildComparableIds } = require('./jidHelper');
 
const DB_FILE = path.join(__dirname, '..', 'database', 'wordgame.json');
const QUESTION_INTERVAL_MS = 10 * 60 * 1000;
const ANNOUNCEMENT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FIRST_QUESTION_DELAY_MS = 60 * 1000;
const POST_ANNOUNCEMENT_DELAY_MS = 60 * 1000;
const GROUP_SYNC_INTERVAL_MS = 10 * 60 * 1000;
const SCHEDULER_TICK_MS = 30 * 1000;
const QUESTION_POINTS = 10;
const TOP_LIMIT = 10;
 
const WORD_BANK = [
  { word: 'TIGER', hint: 'A large striped cat, often orange with black stripes.', category: 'animals' },
  { word: 'ELEPHANT', hint: 'The largest land animal, known for its trunk.', category: 'animals' },
  { word: 'GIRAFFE', hint: 'A very tall animal with a long neck.', category: 'animals' },
  { word: 'DOLPHIN', hint: 'An intelligent sea mammal famous for playful jumps.', category: 'animals' },
  { word: 'PENGUIN', hint: 'A flightless bird that waddles and swims in cold regions.', category: 'animals' },
  { word: 'KANGAROO', hint: 'An Australian marsupial that moves by hopping.', category: 'animals' },
  { word: 'LEOPARD', hint: 'A spotted wild cat known for speed and stealth.', category: 'animals' },
  { word: 'RABBIT', hint: 'A small mammal with long ears that loves carrots.', category: 'animals' },
  { word: 'OCTOPUS', hint: 'A sea creature with eight arms and high intelligence.', category: 'animals' },
  { word: 'PEACOCK', hint: 'A bird famous for its colorful fan-shaped tail.', category: 'animals' },
  { word: 'VOLCANO', hint: 'A mountain that can erupt with lava and ash.', category: 'nature' },
  { word: 'RAINBOW', hint: 'A colorful arc that appears after rain and sunlight.', category: 'nature' },
  { word: 'THUNDER', hint: 'The loud sound that follows lightning.', category: 'nature' },
  { word: 'GLACIER', hint: 'A huge, slow-moving mass of ice.', category: 'nature' },
  { word: 'DESERT', hint: 'A very dry region with little rainfall.', category: 'nature' },
  { word: 'FOREST', hint: 'A large area covered mainly with trees.', category: 'nature' },
  { word: 'ISLAND', hint: 'Land that is completely surrounded by water.', category: 'nature' },
  { word: 'RIVER', hint: 'A flowing natural stream of water.', category: 'nature' },
  { word: 'TORNADO', hint: 'A violently rotating column of air.', category: 'nature' },
  { word: 'WATERFALL', hint: 'Water dropping over a steep cliff or rock face.', category: 'nature' },
  { word: 'GRAVITY', hint: 'The force that pulls objects toward Earth.', category: 'science' },
  { word: 'ATOM', hint: 'A basic unit of matter.', category: 'science' },
  { word: 'GALAXY', hint: 'A huge system of stars, gas, and dust.', category: 'science' },
  { word: 'ROCKET', hint: 'A vehicle designed to travel through space.', category: 'science' },
  { word: 'PLANET', hint: 'A large object that orbits a star.', category: 'science' },
  { word: 'OXYGEN', hint: 'A gas humans need to breathe.', category: 'science' },
  { word: 'NEURON', hint: 'A nerve cell that carries information in the body.', category: 'science' },
  { word: 'MAGNET', hint: 'An object that attracts iron and some other metals.', category: 'science' },
  { word: 'LASER', hint: 'A focused beam of light used in many technologies.', category: 'science' },
  { word: 'MICROSCOPE', hint: 'An instrument used to view very tiny objects.', category: 'science' },
  { word: 'KEYBOARD', hint: 'An input device with keys for typing.', category: 'objects' },
  { word: 'TELESCOPE', hint: 'An instrument used to observe distant objects in space.', category: 'objects' },
  { word: 'UMBRELLA', hint: 'An object used for protection from rain.', category: 'objects' },
  { word: 'BICYCLE', hint: 'A two-wheeled vehicle powered by pedaling.', category: 'objects' },
  { word: 'LANTERN', hint: 'A portable source of light.', category: 'objects' },
  { word: 'COMPASS', hint: 'A tool used for finding direction.', category: 'objects' },
  { word: 'HAMMER', hint: 'A tool used to drive nails.', category: 'objects' },
  { word: 'MIRROR', hint: 'A surface that reflects your image.', category: 'objects' },
  { word: 'BLANKET', hint: 'A soft covering used for warmth.', category: 'objects' },
  { word: 'BACKPACK', hint: 'A bag carried on the back.', category: 'objects' },
  { word: 'PYRAMID', hint: 'An ancient triangular monument found in Egypt.', category: 'general' },
  { word: 'SAFFRON', hint: 'A valuable spice and a color in the Indian flag.', category: 'general' },
  { word: 'DIAMOND', hint: 'A precious stone known for exceptional hardness.', category: 'general' },
  { word: 'CRICKET', hint: 'A sport played with a bat, ball, and wickets.', category: 'general' },
  { word: 'LIBRARY', hint: 'A place full of books and study materials.', category: 'general' },
  { word: 'MOUNTAIN', hint: 'A very high natural rise of the Earth’s surface.', category: 'general' },
  { word: 'CASTLE', hint: 'A large fortified building often linked with kings.', category: 'general' },
  { word: 'ORCHESTRA', hint: 'A large group of musicians playing together.', category: 'general' },
  { word: 'CURRENCY', hint: 'The system of money used in a country.', category: 'general' },
  { word: 'NOTEBOOK', hint: 'A book of blank or ruled pages for writing notes.', category: 'general' },
  { word: 'EAGLE', hint: 'A powerful bird of prey with sharp eyesight.', category: 'animals' },
  { word: 'SPARROW', hint: 'A small common bird often seen near homes.', category: 'animals' },
  { word: 'CROCODILE', hint: 'A large reptile that lives in rivers and swamps.', category: 'animals' },
  { word: 'PANTHER', hint: 'A dark-coated big cat.', category: 'animals' },
  { word: 'BAMBOO', hint: 'A fast-growing plant often eaten by pandas.', category: 'nature' },
  { word: 'MONSOON', hint: 'A seasonal wind pattern associated with heavy rain.', category: 'nature' },
  { word: 'CANYON', hint: 'A deep valley with steep rocky sides.', category: 'nature' },
  { word: 'AURORA', hint: 'Natural colored lights seen in polar skies.', category: 'nature' },
  { word: 'ECLIPSE', hint: 'An event where one celestial body blocks another.', category: 'science' },
  { word: 'SATELLITE', hint: 'An object that orbits a planet, natural or man-made.', category: 'science' },
  { word: 'BATTERY', hint: 'A portable source of stored electrical energy.', category: 'science' },
  { word: 'CLIMATE', hint: 'The long-term weather pattern of a place.', category: 'science' },
  { word: 'PRINTER', hint: 'A machine that produces text or images on paper.', category: 'objects' },
  { word: 'THERMOS', hint: 'A container that keeps liquids hot or cold.', category: 'objects' },
  { word: 'HEADPHONES', hint: 'A device worn over the ears for listening to audio.', category: 'objects' },
  { word: 'TREASURE', hint: 'A collection of valuable items or riches.', category: 'general' },
  { word: 'FESTIVAL', hint: 'A special celebration or cultural event.', category: 'general' },
  { word: 'KINGDOM', hint: 'A land or realm ruled by a king or queen.', category: 'general' },
  { word: 'JOURNEY', hint: 'The act of traveling from one place to another.', category: 'general' }
];
 
function ensureDbDir() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
 
function defaultState() {
  return {
    version: 1,
    groups: {}
  };
}
 
function createDefaultGroupState(groupId, meta = {}) {
  const now = Date.now();
  return {
    id: groupId,
    groupName: meta.subject || meta.name || 'Unknown Group',
    createdAt: now,
    updatedAt: now,
    nextQuestionAt: now + FIRST_QUESTION_DELAY_MS,
    nextAnnouncementAt: now + ANNOUNCEMENT_INTERVAL_MS,
    lastQuestionAt: 0,
    lastAnnouncementAt: 0,
    currentQuestion: null,
    recentWords: [],
    players: {},
    lastReward: null
  };
}
 
function loadState() {
  try {
    ensureDbDir();
    if (!fs.existsSync(DB_FILE)) {
      const initial = defaultState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8').trim();
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultState();
    if (!parsed.groups || typeof parsed.groups !== 'object') parsed.groups = {};
    for (const [groupId, group] of Object.entries(parsed.groups)) {
      parsed.groups[groupId] = {
        ...createDefaultGroupState(groupId),
        ...group,
        players: group?.players && typeof group.players === 'object' ? group.players : {},
        recentWords: Array.isArray(group?.recentWords) ? group.recentWords : [],
        currentQuestion: group?.currentQuestion || null,
        lastReward: group?.lastReward || null
      };
    }
    return parsed;
  } catch (error) {
    console.error('[wordgame] failed to load state:', error.message);
    return defaultState();
  }
}
 
const state = loadState();
let saveTimer = null;
 
const runtime = {
  sock: null,
  timer: null,
  lastGroupSyncAt: 0,
  ticking: false
};
 
function saveNow() {
  try {
    ensureDbDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('[wordgame] failed to save state:', error.message);
  }
}
 
function saveSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 250);
}
 
function unique(list) {
  return [...new Set((list || []).filter(Boolean))];
}
 
function canonicalJid(jid) {
  return normalizeJidWithLid(jid) || String(jid || '');
}
 
function isSameUser(a, b) {
  if (!a || !b) return false;
  const left = new Set(buildComparableIds(a).concat(a));
  return buildComparableIds(b).concat(b).some((value) => left.has(value));
}
 
function normalizeAnswer(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}
 
function maskWord(word) {
  const chars = String(word || '').toUpperCase().split('');
  if (chars.length <= 2) return chars.join('');
 
  const visible = new Set([0, chars.length - 1]);
  if (chars.length > 4) {
    visible.add(Math.floor(chars.length / 2));
  }
 
  return chars.map((char, index) => {
    if (!/[A-Z0-9]/.test(char)) return char;
    return visible.has(index) ? char : '_';
  }).join('');
}
 
function friendlyName(jid, storedName) {
  const fromCache = lookupName(jid);
  if (isNiceName(storedName)) return String(storedName).trim();
  if (isNiceName(fromCache)) return String(fromCache).trim();
  const user = String(jid || '').split('@')[0].split(':')[0];
  return user ? `@${user}` : 'Unknown Player';
}
 
function mentionTag(jid) {
  return `@${String(jid || '').split('@')[0].split(':')[0]}`;
}
 
function formatDelay(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}
 
function ensureGroupState(groupId, meta = {}) {
  if (!groupId || !String(groupId).endsWith('@g.us')) return null;
  if (!state.groups[groupId]) {
    state.groups[groupId] = createDefaultGroupState(groupId, meta);
  }
  const group = state.groups[groupId];
  if (meta.subject || meta.name) {
    group.groupName = meta.subject || meta.name;
  }
  group.updatedAt = Date.now();
  saveSoon();
  return group;
}
 
function ensurePlayer(group, jid, name) {
  const key = canonicalJid(jid);
  if (!group.players[key]) {
    group.players[key] = {
      id: key,
      name: '',
      dailyPoints: 0,
      lifetimePoints: 0,
      correctAnswers: 0,
      lifetimeWins: 0,
      lastCorrectAt: 0
    };
  }
  if (isNiceName(name)) {
    group.players[key].name = String(name).trim();
  }
  return group.players[key];
}
 
function buildLeaderboard(group, limit = TOP_LIMIT) {
  return Object.values(group.players || {})
    .filter((player) => (player.dailyPoints || 0) > 0)
    .sort((a, b) => {
      if ((b.dailyPoints || 0) !== (a.dailyPoints || 0)) {
        return (b.dailyPoints || 0) - (a.dailyPoints || 0);
      }
      if ((b.correctAnswers || 0) !== (a.correctAnswers || 0)) {
        return (b.correctAnswers || 0) - (a.correctAnswers || 0);
      }
      if ((b.lifetimePoints || 0) !== (a.lifetimePoints || 0)) {
        return (b.lifetimePoints || 0) - (a.lifetimePoints || 0);
      }
      return (a.lastCorrectAt || 0) - (b.lastCorrectAt || 0);
    })
    .slice(0, limit)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
      displayName: friendlyName(player.id, player.name)
    }));
}
 
function pickQuestion(group) {
  const recent = new Set((group.recentWords || []).slice(-15));
  const pool = WORD_BANK.filter((entry) => !recent.has(entry.word));
  const source = pool.length ? pool : WORD_BANK;
  const picked = source[Math.floor(Math.random() * source.length)];
  group.recentWords = [...(group.recentWords || []), picked.word].slice(-25);
  return {
    id: `word-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    word: picked.word,
    normalizedWord: normalizeAnswer(picked.word),
    masked: maskWord(picked.word),
    hint: picked.hint,
    category: picked.category,
    askedAt: Date.now()
  };
}
 
async function safeSend(sock, jid, payload, options = {}) {
  if (!sock?.ws?.isOpen && sock?.ws?.readyState !== 1) {
    throw new Error('socket-not-ready');
  }
  return sock.sendMessage(jid, payload, options);
}
 
async function syncGroups(sock) {
  if (!sock?.groupFetchAllParticipating) return;
  const now = Date.now();
  if (now - runtime.lastGroupSyncAt < GROUP_SYNC_INTERVAL_MS) return;
  runtime.lastGroupSyncAt = now;
 
  try {
    const groups = await sock.groupFetchAllParticipating();
    for (const group of Object.values(groups || {})) {
      ensureGroupState(group.id, { subject: group.subject || group.name });
    }
  } catch (error) {
    console.error('[wordgame] group sync failed:', error.message);
  }
}
 
async function fetchGroupMetadata(sock, groupId) {
  try {
    if (!sock?.groupMetadata) return null;
    return await sock.groupMetadata(groupId);
  } catch (error) {
    console.error(`[wordgame] metadata failed for ${groupId}:`, error.message);
    return null;
  }
}
 
async function sendNextQuestion(sock, groupId, group, metadata) {
  const now = Date.now();
  const previous = group.currentQuestion;
  const question = pickQuestion(group);
 
  let intro = '';
  if (previous && !previous.answeredBy) {
    intro = `⏰ Time's up! The previous word was *${previous.word}*.\n\n`;
  }
 
  const text = [
    '🎯 *Word Guess Round*',
    '',
    `${intro}🧩 *Masked Word:* ${question.masked}`,
    `💡 *Hint:* ${question.hint}`,
    `📚 *Category:* ${question.category}`,
    `🏅 *Reward:* ${QUESTION_POINTS} points`,
    '',
    'Send your answer in the group. The first correct reply wins.'
  ].join('\n');
 
  await safeSend(sock, groupId, { text });
 
  group.currentQuestion = question;
  group.lastQuestionAt = now;
  group.nextQuestionAt = now + QUESTION_INTERVAL_MS;
  if (metadata?.subject) group.groupName = metadata.subject;
  saveSoon();
}
 
function buildAnnouncementText(group, leaderboard, participantIds) {
  const mentionBlock = participantIds.length
    ? participantIds.map((jid) => mentionTag(jid)).join(' ')
    : '';
 
  if (!leaderboard.length) {
    return {
      text: [
        '🏆 *Daily Word Guess Results*',
        '',
        'No winner today. No points were scored in this group during the last 24 hours.',
        '',
        mentionBlock
      ].filter(Boolean).join('\n'),
      mentions: participantIds
    };
  }
 
  const winner = leaderboard[0];
  return {
    text: [
      '🏆 *Daily Word Guess Winner*',
      '',
      `🥇 *Winner:* ${mentionTag(winner.id)} (${winner.displayName})`,
      `⭐ *Daily Points:* ${winner.dailyPoints}`,
      `🎯 *Correct Answers:* ${winner.correctAnswers}`,
      `📈 *Final Rank:* #${winner.rank}`,
      '',
      `🎁 Winner can request a sticker pack with *${config.prefix}wordreward <pack name>*`,
      '',
      '📣 *Group Mentions:*',
      mentionBlock
    ].filter(Boolean).join('\n'),
    mentions: unique([winner.id, ...participantIds])
  };
}
 
function resetDailyScores(group, leaderboard, endedAt) {
  const winner = leaderboard[0] || null;
  if (winner && group.players[winner.id]) {
    group.players[winner.id].lifetimeWins = (group.players[winner.id].lifetimeWins || 0) + 1;
  }
 
  group.lastReward = winner ? {
    winnerId: winner.id,
    winnerName: winner.displayName,
    totalPoints: winner.dailyPoints,
    finalRank: winner.rank,
    announcedAt: endedAt,
    requested: false,
    requestedPack: '',
    requestedAt: 0
  } : {
    winnerId: '',
    winnerName: '',
    totalPoints: 0,
    finalRank: 0,
    announcedAt: endedAt,
    requested: false,
    requestedPack: '',
    requestedAt: 0
  };
 
  for (const player of Object.values(group.players || {})) {
    player.dailyPoints = 0;
  }
 
  group.currentQuestion = null;
  group.lastAnnouncementAt = endedAt;
  group.nextAnnouncementAt = endedAt + ANNOUNCEMENT_INTERVAL_MS;
  group.nextQuestionAt = Math.max(group.nextQuestionAt || 0, endedAt + POST_ANNOUNCEMENT_DELAY_MS);
  saveSoon();
}
 
async function announceDailyWinner(sock, groupId, group, metadata) {
  const now = Date.now();
  const participantIds = unique(
    (metadata?.participants || [])
      .map((participant) => participant.id || participant.lid || participant.userJid)
      .filter(Boolean)
      .filter((jid) => !isSameUser(jid, sock?.user?.id))
  );
 
  const leaderboard = buildLeaderboard(group, TOP_LIMIT);
  const payload = buildAnnouncementText(group, leaderboard, participantIds);
  await safeSend(sock, groupId, payload);
  resetDailyScores(group, leaderboard, now);
}
 
async function tick() {
  if (runtime.ticking) return;
  if (!runtime.sock) return;
  if (!runtime.sock.ws?.isOpen && runtime.sock.ws?.readyState !== 1) return;
 
  runtime.ticking = true;
  try {
    await syncGroups(runtime.sock);
 
    const now = Date.now();
    for (const [groupId, group] of Object.entries(state.groups)) {
      if (!String(groupId).endsWith('@g.us')) continue;
 
      if (now >= (group.nextAnnouncementAt || 0)) {
        const metadata = await fetchGroupMetadata(runtime.sock, groupId);
        try {
          await announceDailyWinner(runtime.sock, groupId, group, metadata);
        } catch (error) {
          console.error(`[wordgame] announcement failed for ${groupId}:`, error.message);
        }
      }
 
      if (now >= (group.nextQuestionAt || 0)) {
        const metadata = await fetchGroupMetadata(runtime.sock, groupId);
        try {
          await sendNextQuestion(runtime.sock, groupId, group, metadata);
        } catch (error) {
          console.error(`[wordgame] question failed for ${groupId}:`, error.message);
        }
      }
    }
  } finally {
    runtime.ticking = false;
  }
}
 
function start(sock) {
  runtime.sock = sock;
  syncGroups(sock).catch(() => {});
  if (runtime.timer) return;
  runtime.timer = setInterval(() => {
    tick().catch((error) => {
      console.error('[wordgame] scheduler tick failed:', error.message);
    });
  }, SCHEDULER_TICK_MS);
}
 
async function handleIncomingGuess(sock, msg, extra) {
  try {
    if (!extra?.from || !extra?.sender || !extra?.body) return false;
    if (!extra.isGroup || msg?.key?.fromMe) return false;
    if (String(extra.body).startsWith(config.prefix)) return false;
 
    const group = ensureGroupState(extra.from, { subject: extra.groupMetadata?.subject });
    if (!group?.currentQuestion || group.currentQuestion.answeredBy) return false;
 
    const attempt = normalizeAnswer(extra.body);
    if (!attempt || attempt.length < 2) return false;
    if (attempt !== group.currentQuestion.normalizedWord) return false;
 
    const player = ensurePlayer(group, extra.sender, extra.pushName);
    const now = Date.now();
 
    group.currentQuestion.answeredBy = canonicalJid(extra.sender);
    group.currentQuestion.answeredAt = now;
    player.dailyPoints = (player.dailyPoints || 0) + QUESTION_POINTS;
    player.lifetimePoints = (player.lifetimePoints || 0) + QUESTION_POINTS;
    player.correctAnswers = (player.correctAnswers || 0) + 1;
    player.lastCorrectAt = now;
    if (isNiceName(extra.pushName)) player.name = String(extra.pushName).trim();
 
    const board = buildLeaderboard(group, TOP_LIMIT);
    const rank = board.find((entry) => isSameUser(entry.id, player.id))?.rank || 1;
    const displayName = friendlyName(player.id, player.name);
    const solvedWord = group.currentQuestion.word;
    group.currentQuestion = null;
    saveSoon();
 
    const lines = [
      '🎉 *Correct Answer!*',
      '',
      `${mentionTag(player.id)} guessed *${solvedWord}* first.`,
      `🏅 Points earned: +${QUESTION_POINTS}`,
      `📊 Daily points: ${player.dailyPoints}`,
      `🏆 Rank: #${rank}`,
      `👤 Player: ${displayName}`
    ];
 
    await safeSend(sock, extra.from, {
      text: lines.join('\n'),
      mentions: [player.id]
    }, { quoted: msg });
 
    return true;
  } catch (error) {
    console.error('[wordgame] guess handler failed:', error.message);
    return false;
  }
}
 
function getGroup(groupId, meta = {}) {
  return ensureGroupState(groupId, meta);
}
 
function getLeaderboardMessage(groupId) {
  const group = ensureGroupState(groupId);
  const leaderboard = buildLeaderboard(group, TOP_LIMIT);
  const active = group.currentQuestion;
  const timeLeft = formatDelay((group.nextQuestionAt || 0) - Date.now());
  const announcementIn = formatDelay((group.nextAnnouncementAt || 0) - Date.now());
 
  const lines = [
    '🏆 *Word Guess Leaderboard*',
    '',
    `👥 *Group:* ${group.groupName || 'Unknown Group'}`,
    `⏱️ *Next Round:* ${timeLeft}`,
    `📅 *Daily Results In:* ${announcementIn}`,
    ''
  ];
 
  if (active) {
    lines.push(`🧩 *Active Word:* ${active.masked}`);
    lines.push(`💡 *Hint:* ${active.hint}`);
    lines.push('');
  }
 
  if (!leaderboard.length) {
    lines.push('No points on the current daily leaderboard yet.');
  } else {
    lines.push('📊 *Current Rankings:*');
    leaderboard.forEach((player) => {
      lines.push(
        `${player.rank}. ${player.displayName} - ${player.dailyPoints} pts | lifetime ${player.lifetimePoints} | wins ${player.lifetimeWins || 0}`
      );
    });
  }
 
  if (group.lastReward?.winnerId) {
    lines.push('');
    lines.push(
      `🎁 *Last Winner:* ${group.lastReward.winnerName} (${group.lastReward.totalPoints} pts)`
    );
  }
 
  return {
    text: lines.join('\n'),
    mentions: leaderboard.map((player) => player.id)
  };
}
 
function requestReward(groupId, sender, packName, meta = {}) {
  const group = ensureGroupState(groupId, meta);
  const reward = group.lastReward;
  const cleanedPack = String(packName || '').trim();
 
  if (!reward?.winnerId) {
    return { ok: false, code: 'no_winner' };
  }
  if (!isSameUser(sender, reward.winnerId)) {
    return {
      ok: false,
      code: 'not_winner',
      winnerName: reward.winnerName,
      winnerId: reward.winnerId
    };
  }
  if (!cleanedPack) {
    return { ok: false, code: 'missing_pack' };
  }
  if (cleanedPack.length < 2 || cleanedPack.length > 80) {
    return { ok: false, code: 'invalid_pack' };
  }
  if (reward.requested) {
    return {
      ok: false,
      code: 'already_requested',
      requestedPack: reward.requestedPack
    };
  }
 
  reward.requested = true;
  reward.requestedPack = cleanedPack;
  reward.requestedAt = Date.now();
  saveSoon();
 
  return {
    ok: true,
    reward,
    packName: cleanedPack,
    winnerDisplayName: friendlyName(sender, meta.pushName)
  };
}
 
function getStats() {
  return {
    dbFile: DB_FILE,
    questionIntervalMs: QUESTION_INTERVAL_MS,
    announcementIntervalMs: ANNOUNCEMENT_INTERVAL_MS,
    questionPoints: QUESTION_POINTS
  };
}
 
module.exports = {
  start,
  tick,
  syncGroups,
  ensureGroupState,
  getGroup,
  getStats,
  getLeaderboardMessage,
  handleIncomingGuess,
  requestReward
};
