const fs = require('fs');
const path = require('path');
const config = require('../config');
const database = require('../database');
const { isNiceName, lookupName } = require('./nameCache');
const { normalizeJidWithLid, buildComparableIds } = require('./jidHelper');
 
const DB_FILE = path.join(__dirname, '..', 'database', 'wordgame.json');
const QUESTION_INTERVAL_MS = 10 * 60 * 1000;
const ANNOUNCEMENT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FIRST_QUESTION_DELAY_MS = QUESTION_INTERVAL_MS;
const POST_ANNOUNCEMENT_DELAY_MS = QUESTION_INTERVAL_MS;
const GROUP_SYNC_INTERVAL_MS = 10 * 60 * 1000;
const SCHEDULER_TICK_MS = 30 * 1000;
const QUESTION_POINTS = 10;
const DAILY_LIMIT = 10;
const LIFETIME_LIMIT = 5;
const RECENT_WORDS_LIMIT = 30;
 
const WORD_BANK = [
  { word: 'TIGER', hint: 'A large striped cat, often orange with black stripes.', category: 'animals' },
  { word: 'ELEPHANT', hint: 'The largest land animal, known for its trunk and tusks.', category: 'animals' },
  { word: 'GIRAFFE', hint: 'The tallest mammal, famous for its long neck.', category: 'animals' },
  { word: 'DOLPHIN', hint: 'An intelligent marine mammal known for playful behavior.', category: 'animals' },
  { word: 'PENGUIN', hint: 'A flightless bird that waddles and swims in cold regions.', category: 'animals' },
  { word: 'KANGAROO', hint: 'An Australian marsupial that moves by hopping.', category: 'animals' },
  { word: 'LEOPARD', hint: 'A spotted wild cat known for speed and stealth.', category: 'animals' },
  { word: 'RABBIT', hint: 'A small mammal with long ears that loves carrots.', category: 'animals' },
  { word: 'OCTOPUS', hint: 'A sea creature with eight arms and high intelligence.', category: 'animals' },
  { word: 'PEACOCK', hint: 'A bird famous for its colorful fan-shaped tail.', category: 'animals' },
  { word: 'EAGLE', hint: 'A powerful bird of prey with sharp eyesight.', category: 'animals' },
  { word: 'SPARROW', hint: 'A small common bird often seen near homes.', category: 'animals' },
  { word: 'CROCODILE', hint: 'A large reptile that lives in rivers and swamps.', category: 'animals' },
  { word: 'PANTHER', hint: 'A dark-coated big cat.', category: 'animals' },
  { word: 'CHEETAH', hint: 'The fastest land animal.', category: 'animals' },
  { word: 'KOALA', hint: 'An Australian animal that sleeps in eucalyptus trees.', category: 'animals' },
  { word: 'PARROT', hint: 'A colorful bird known for copying sounds.', category: 'animals' },
  { word: 'TURTLE', hint: 'A reptile with a hard shell that moves slowly.', category: 'animals' },
  { word: 'BUFFALO', hint: 'A large horned animal often seen on farms and plains.', category: 'animals' },
  { word: 'SQUIRREL', hint: 'A small animal that stores nuts and climbs trees.', category: 'animals' },
  { word: 'CHAMELEON', hint: 'A reptile famous for changing color.', category: 'animals' },
  { word: 'RHINOCEROS', hint: 'A heavy animal with one or two horns on its nose.', category: 'animals' },
  { word: 'JELLYFISH', hint: 'A soft sea creature with a bell-shaped body and tentacles.', category: 'animals' },
  { word: 'HEDGEHOG', hint: 'A small spiny mammal that curls into a ball.', category: 'animals' },
  { word: 'SEAHORSE', hint: 'A tiny marine animal with a horse-like head.', category: 'animals' },
 
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
  { word: 'BAMBOO', hint: 'A fast-growing plant often eaten by pandas.', category: 'nature' },
  { word: 'MONSOON', hint: 'A seasonal wind pattern associated with heavy rain.', category: 'nature' },
  { word: 'CANYON', hint: 'A deep valley with steep rocky sides.', category: 'nature' },
  { word: 'AURORA', hint: 'Natural colored lights seen in polar skies.', category: 'nature' },
  { word: 'MEADOW', hint: 'An open field covered with grass and wildflowers.', category: 'nature' },
  { word: 'OCEAN', hint: 'A vast body of salt water covering much of Earth.', category: 'nature' },
  { word: 'AVALANCHE', hint: 'A sudden flow of snow rushing down a mountain.', category: 'nature' },
  { word: 'TSUNAMI', hint: 'A giant sea wave caused by underwater disturbances.', category: 'nature' },
  { word: 'VALLEY', hint: 'Low land between hills or mountains.', category: 'nature' },
  { word: 'SAVANNA', hint: 'A grassy plain with scattered trees in warm regions.', category: 'nature' },
  { word: 'HORIZON', hint: 'The line where the earth and sky seem to meet.', category: 'nature' },
  { word: 'CORALREEF', hint: 'An underwater ecosystem built by tiny sea animals.', category: 'nature' },
  { word: 'SUNSHINE', hint: 'Light and warmth coming from the sun.', category: 'nature' },
  { word: 'RAINFOREST', hint: 'A dense forest with heavy rainfall and rich wildlife.', category: 'nature' },
  { word: 'EARTHQUAKE', hint: 'A sudden shaking of the ground caused by movement below Earth.', category: 'nature' },
 
  { word: 'GRAVITY', hint: 'The force that pulls objects toward Earth.', category: 'science' },
  { word: 'ATOM', hint: 'A basic unit of matter.', category: 'science' },
  { word: 'GALAXY', hint: 'A huge system of stars, gas, and dust.', category: 'science' },
  { word: 'ROCKET', hint: 'A vehicle designed to travel through space.', category: 'science' },
  { word: 'PLANET', hint: 'A large celestial body that orbits a star.', category: 'science' },
  { word: 'OXYGEN', hint: 'A gas humans need to breathe.', category: 'science' },
  { word: 'NEURON', hint: 'A nerve cell that carries information in the body.', category: 'science' },
  { word: 'MAGNET', hint: 'An object that attracts iron and some other metals.', category: 'science' },
  { word: 'LASER', hint: 'A focused beam of light used in many technologies.', category: 'science' },
  { word: 'MICROSCOPE', hint: 'An instrument used to view very tiny objects.', category: 'science' },
  { word: 'ECLIPSE', hint: 'An event where one celestial body blocks another.', category: 'science' },
  { word: 'SATELLITE', hint: 'An object that orbits a planet, natural or man-made.', category: 'science' },
  { word: 'BATTERY', hint: 'A portable source of stored electrical energy.', category: 'science' },
  { word: 'CLIMATE', hint: 'The long-term weather pattern of a place.', category: 'science' },
  { word: 'MOLECULE', hint: 'A group of atoms bonded together.', category: 'science' },
  { word: 'TELESCOPE', hint: 'An instrument used to observe distant objects.', category: 'science' },
  { word: 'QUANTUM', hint: 'A term used for the smallest amount in modern physics.', category: 'science' },
  { word: 'VACCINE', hint: 'A biological preparation that helps protect against disease.', category: 'science' },
  { word: 'FOSSIL', hint: 'Preserved remains or traces of ancient life.', category: 'science' },
  { word: 'PLASMA', hint: 'A state of matter made of charged particles.', category: 'science' },
  { word: 'THERMAL', hint: 'Related to heat.', category: 'science' },
  { word: 'BIOLOGY', hint: 'The science of living organisms.', category: 'science' },
  { word: 'CHEMISTRY', hint: 'The branch of science that studies substances and reactions.', category: 'science' },
  { word: 'ASTEROID', hint: 'A small rocky body orbiting the sun.', category: 'science' },
  { word: 'COMPASSION', hint: 'This is not science.', category: 'science' },
 
  { word: 'KEYBOARD', hint: 'An input device with keys for typing.', category: 'objects' },
  { word: 'UMBRELLA', hint: 'An object used for protection from rain.', category: 'objects' },
  { word: 'BICYCLE', hint: 'A two-wheeled vehicle powered by pedaling.', category: 'objects' },
  { word: 'LANTERN', hint: 'A portable source of light.', category: 'objects' },
  { word: 'COMPASS', hint: 'A tool used for finding direction.', category: 'objects' },
  { word: 'HAMMER', hint: 'A tool used to drive nails.', category: 'objects' },
  { word: 'MIRROR', hint: 'A surface that reflects your image.', category: 'objects' },
  { word: 'BLANKET', hint: 'A soft covering used for warmth.', category: 'objects' },
  { word: 'BACKPACK', hint: 'A bag carried on the back.', category: 'objects' },
  { word: 'PRINTER', hint: 'A machine that produces text or images on paper.', category: 'objects' },
  { word: 'THERMOS', hint: 'A container that keeps liquids hot or cold.', category: 'objects' },
  { word: 'HEADPHONES', hint: 'A device worn over the ears for listening to audio.', category: 'objects' },
  { word: 'NOTEBOOK', hint: 'A book of blank or ruled pages for notes.', category: 'objects' },
  { word: 'BINOCULARS', hint: 'A handheld tool for viewing faraway objects.', category: 'objects' },
  { word: 'FLASHLIGHT', hint: 'A portable electric light.', category: 'objects' },
  { word: 'MICROWAVE', hint: 'A kitchen appliance used to heat food quickly.', category: 'objects' },
  { word: 'SCISSORS', hint: 'A cutting tool with two blades.', category: 'objects' },
  { word: 'TEAPOT', hint: 'A container used for brewing and pouring tea.', category: 'objects' },
  { word: 'PROJECTOR', hint: 'A device that displays images onto a screen or wall.', category: 'objects' },
  { word: 'SUITCASE', hint: 'A travel case used to carry clothes and belongings.', category: 'objects' },
  { word: 'WHEELBARROW', hint: 'A single-wheel carrier used for moving loads.', category: 'objects' },
  { word: 'TOOTHBRUSH', hint: 'An item used to clean teeth.', category: 'objects' },
  { word: 'NOTEPAD', hint: 'A pad of paper for quick writing.', category: 'objects' },
  { word: 'DRUMSTICK', hint: 'A stick used to play drums.', category: 'objects' },
  { word: 'SPECTACLES', hint: 'Another word for eyeglasses.', category: 'objects' },
 
  { word: 'PYRAMID', hint: 'An ancient triangular monument found in Egypt.', category: 'general' },
  { word: 'SAFFRON', hint: 'A valuable spice and a color in the Indian flag.', category: 'general' },
  { word: 'DIAMOND', hint: 'A precious stone known for exceptional hardness.', category: 'general' },
  { word: 'CRICKET', hint: 'A sport played with a bat, ball, and wickets.', category: 'general' },
  { word: 'LIBRARY', hint: 'A place full of books and study materials.', category: 'general' },
  { word: 'MOUNTAIN', hint: 'A very high natural rise of Earth’s surface.', category: 'general' },
  { word: 'CASTLE', hint: 'A large fortified building often linked with kings.', category: 'general' },
  { word: 'ORCHESTRA', hint: 'A large group of musicians playing together.', category: 'general' },
  { word: 'CURRENCY', hint: 'The system of money used in a country.', category: 'general' },
  { word: 'TREASURE', hint: 'A collection of valuable items or riches.', category: 'general' },
  { word: 'FESTIVAL', hint: 'A special celebration or cultural event.', category: 'general' },
  { word: 'KINGDOM', hint: 'A land or realm ruled by a king or queen.', category: 'general' },
  { word: 'JOURNEY', hint: 'The act of traveling from one place to another.', category: 'general' },
  { word: 'HARMONY', hint: 'A pleasing combination of parts or sounds.', category: 'general' },
  { word: 'VICTORY', hint: 'Success in a contest or battle.', category: 'general' },
  { word: 'MUSEUM', hint: 'A place where important objects are displayed.', category: 'general' },
  { word: 'COMPASSION', hint: 'Kind concern for the suffering of others.', category: 'general' },
  { word: 'TRIANGLE', hint: 'A shape with three sides.', category: 'general' },
  { word: 'CHAMPION', hint: 'A winner or title holder.', category: 'general' },
  { word: 'HOSPITAL', hint: 'A place where sick or injured people are treated.', category: 'general' },
  { word: 'CAPITAL', hint: 'The main city of a country or region.', category: 'general' },
  { word: 'ADVENTURE', hint: 'An exciting and sometimes risky experience.', category: 'general' },
  { word: 'LANGUAGE', hint: 'A system used by people to communicate.', category: 'general' },
  { word: 'HISTORY', hint: 'The study of past events.', category: 'general' },
  { word: 'PUZZLE', hint: 'A game or problem that tests cleverness.', category: 'general' },
];
 
function ensureDbDir() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
 
function defaultState() {
  return {
    version: 2,
    groups: {},
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
    lastReward: {
      winnerId: '',
      winnerName: '',
      totalPoints: 0,
      finalRank: 0,
      correctAnswers: 0,
      announcedAt: 0,
      requested: false,
      requestStatus: 'none',
      requestedPack: '',
      requestedAt: 0,
      decidedBy: '',
      decidedByName: '',
      decidedAt: 0,
      decisionNote: '',
    },
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
        ...(group || {}),
        players: group?.players && typeof group.players === 'object' ? group.players : {},
        recentWords: Array.isArray(group?.recentWords) ? group.recentWords : [],
        currentQuestion: group?.currentQuestion || null,
        lastReward: {
          ...createDefaultGroupState(groupId).lastReward,
          ...(group?.lastReward || {}),
        },
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
  ticking: false,
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
 
function isSameUser(left, right) {
  if (!left || !right) return false;
  const leftSet = new Set(buildComparableIds(left).concat(String(left)));
  return buildComparableIds(right).concat(String(right)).some((value) => leftSet.has(value));
}
 
function mentionTag(jid) {
  return `@${String(jid || '').split('@')[0].split(':')[0]}`;
}
 
function normalizeAnswer(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}
 
function maskWord(word) {
  const chars = String(word || '').toUpperCase().split('');
  if (chars.length <= 2) return chars.join('');
 
  const visible = new Set([0, chars.length - 1]);
  if (chars.length > 4) visible.add(Math.floor(chars.length / 2));
  if (chars.length > 7) visible.add(2);
 
  return chars.map((char, index) => {
    if (!/[A-Z0-9]/.test(char)) return char;
    return visible.has(index) ? char : '_';
  }).join('');
}
 
function formatDelay(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0m 0s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
 
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}
 
function friendlyName(jid, storedName) {
  const fromCache = lookupName(jid);
  if (isNiceName(storedName)) return String(storedName).trim();
  if (isNiceName(fromCache)) return String(fromCache).trim();
  const user = String(jid || '').split('@')[0].split(':')[0];
  return user ? `@${user}` : 'Unknown Player';
}
 
function isGameEnabled(groupId) {
  return Boolean(database.getGroupSettings(groupId).wordgame);
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
      lastCorrectAt: 0,
    };
  }
 
  if (isNiceName(name)) {
    group.players[key].name = String(name).trim();
  }
 
  return group.players[key];
}
 
function compareDaily(a, b) {
  if ((b.dailyPoints || 0) !== (a.dailyPoints || 0)) {
    return (b.dailyPoints || 0) - (a.dailyPoints || 0);
  }
  if ((b.correctAnswers || 0) !== (a.correctAnswers || 0)) {
    return (b.correctAnswers || 0) - (a.correctAnswers || 0);
  }
  if ((a.lastCorrectAt || 0) !== (b.lastCorrectAt || 0)) {
    return (a.lastCorrectAt || 0) - (b.lastCorrectAt || 0);
  }
  return friendlyName(a.id, a.name).localeCompare(friendlyName(b.id, b.name));
}
 
function compareLifetime(a, b) {
  if ((b.lifetimePoints || 0) !== (a.lifetimePoints || 0)) {
    return (b.lifetimePoints || 0) - (a.lifetimePoints || 0);
  }
  if ((b.lifetimeWins || 0) !== (a.lifetimeWins || 0)) {
    return (b.lifetimeWins || 0) - (a.lifetimeWins || 0);
  }
  if ((b.correctAnswers || 0) !== (a.correctAnswers || 0)) {
    return (b.correctAnswers || 0) - (a.correctAnswers || 0);
  }
  return friendlyName(a.id, a.name).localeCompare(friendlyName(b.id, b.name));
}
 
function buildDailyLeaderboard(group, limit = DAILY_LIMIT) {
  return Object.values(group.players || {})
    .filter((player) => (player.dailyPoints || 0) > 0)
    .sort(compareDaily)
    .slice(0, limit)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
      displayName: friendlyName(player.id, player.name),
    }));
}
 
function buildLifetimeLeaderboard(group, limit = LIFETIME_LIMIT) {
  return Object.values(group.players || {})
    .filter((player) => (player.lifetimePoints || 0) > 0)
    .sort(compareLifetime)
    .slice(0, limit)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
      displayName: friendlyName(player.id, player.name),
    }));
}
 
function getTopTieCandidates(group) {
  const players = Object.values(group.players || {})
    .filter((player) => (player.dailyPoints || 0) > 0)
    .sort(compareDaily);
 
  if (!players.length) return [];
 
  const first = players[0];
  return players.filter((player) => (
    (player.dailyPoints || 0) === (first.dailyPoints || 0)
    && (player.correctAnswers || 0) === (first.correctAnswers || 0)
  )).map((player) => ({
    ...player,
    displayName: friendlyName(player.id, player.name),
  }));
}
 
function pickQuestion(group) {
  const recent = new Set((group.recentWords || []).slice(-15));
  const pool = WORD_BANK.filter((entry) => !recent.has(entry.word));
  const source = pool.length ? pool : WORD_BANK;
  const picked = source[Math.floor(Math.random() * source.length)];
 
  group.recentWords = [...(group.recentWords || []), picked.word].slice(-RECENT_WORDS_LIMIT);
 
  return {
    id: `word-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    word: picked.word,
    normalizedWord: normalizeAnswer(picked.word),
    masked: maskWord(picked.word),
    hint: picked.hint,
    category: picked.category,
    askedAt: Date.now(),
    answeredBy: '',
    answeredAt: 0,
  };
}
 
function isSocketReady(sock) {
  return Boolean(sock && (sock.ws?.isOpen || sock.ws?.readyState === 1));
}
 
async function safeSend(sock, jid, payload, options = {}) {
  if (!isSocketReady(sock)) {
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
 
  const intro = previous && !previous.answeredBy
    ? `⏰ Time's up. The previous word was *${previous.word}*.\n\n`
    : '';
 
  const text = [
    '🎯 *Word Guess Round*',
    '',
    `${intro}🧩 *Masked Word:* ${question.masked}`,
    `💡 *Hint:* ${question.hint}`,
    `📚 *Category:* ${question.category}`,
    `🏅 *Reward:* +${QUESTION_POINTS} points`,
    '',
    'Reply in the group with the exact word. First correct answer wins.',
  ].join('\n');
 
  await safeSend(sock, groupId, { text });
 
  group.currentQuestion = question;
  group.lastQuestionAt = now;
  group.nextQuestionAt = now + QUESTION_INTERVAL_MS;
  if (metadata?.subject) group.groupName = metadata.subject;
  saveSoon();
}
 
function buildAnnouncementText(group, dailyBoard, tieCandidates, participantIds) {
  const mentionBlock = participantIds.length
    ? participantIds.map((jid) => mentionTag(jid)).join(' ')
    : '';
 
  if (!dailyBoard.length) {
    return {
      text: [
        '🏆 *Daily Word Guess Results*',
        '',
        'No winner today. Nobody scored points in the last 24 hours.',
        '',
        mentionBlock,
      ].filter(Boolean).join('\n'),
      mentions: participantIds,
    };
  }
 
  const winner = dailyBoard[0];
  const runners = dailyBoard.slice(0, 3).map((player) => {
    const badge = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉';
    return `${badge} #${player.rank} ${mentionTag(player.id)} - ${player.dailyPoints} pts`;
  }).join('\n');
 
  const tieLine = tieCandidates.length > 1
    ? `⚖️ *Tie Rule:* ${tieCandidates.length} players tied on points. Winner selected by more correct answers, then earlier final correct answer.`
    : '⚖️ *Tie Rule:* Higher daily points wins. Ties use correct answers, then earlier final correct answer.';
 
  return {
    text: [
      '🏆 *Daily Word Guess Winner*',
      '',
      `🥇 *Winner:* ${mentionTag(winner.id)} (${winner.displayName})`,
      `⭐ *Daily Points:* ${winner.dailyPoints}`,
      `🎯 *Correct Answers:* ${winner.correctAnswers}`,
      `📈 *Final Rank:* #${winner.rank}`,
      '',
      '📊 *Top 3 Today:*',
      runners,
      '',
      tieLine,
      '🎁 Winner may request a sticker pack with admin approval using *' + config.prefix + 'wordreward <pack name>*',
      '',
      mentionBlock,
    ].filter(Boolean).join('\n'),
    mentions: unique([winner.id, ...participantIds]),
  };
}
 
function resetDailyScores(group, dailyBoard, endedAt) {
  const winner = dailyBoard[0] || null;
 
  if (winner && group.players[winner.id]) {
    group.players[winner.id].lifetimeWins = (group.players[winner.id].lifetimeWins || 0) + 1;
  }
 
  group.lastReward = winner ? {
    winnerId: winner.id,
    winnerName: winner.displayName,
    totalPoints: winner.dailyPoints,
    finalRank: winner.rank,
    correctAnswers: winner.correctAnswers || 0,
    announcedAt: endedAt,
    requested: false,
    requestStatus: 'none',
    requestedPack: '',
    requestedAt: 0,
    decidedBy: '',
    decidedByName: '',
    decidedAt: 0,
    decisionNote: '',
  } : {
    ...group.lastReward,
    winnerId: '',
    winnerName: '',
    totalPoints: 0,
    finalRank: 0,
    correctAnswers: 0,
    announcedAt: endedAt,
    requested: false,
    requestStatus: 'none',
    requestedPack: '',
    requestedAt: 0,
    decidedBy: '',
    decidedByName: '',
    decidedAt: 0,
    decisionNote: '',
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
  const participantIds = unique(
    (metadata?.participants || [])
      .map((participant) => participant.id || participant.lid || participant.userJid)
      .filter(Boolean)
      .filter((jid) => !isSameUser(jid, sock?.user?.id))
  );
 
  const dailyBoard = buildDailyLeaderboard(group, DAILY_LIMIT);
  const tieCandidates = getTopTieCandidates(group);
  const payload = buildAnnouncementText(group, dailyBoard, tieCandidates, participantIds);
 
  await safeSend(sock, groupId, payload);
  resetDailyScores(group, dailyBoard, Date.now());
}
 
async function tick() {
  if (runtime.ticking || !runtime.sock || !isSocketReady(runtime.sock)) return;
 
  runtime.ticking = true;
  try {
    await syncGroups(runtime.sock);
 
    const now = Date.now();
    for (const [groupId, group] of Object.entries(state.groups)) {
      if (!String(groupId).endsWith('@g.us')) continue;
      if (!isGameEnabled(groupId)) continue;
 
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
 
function setEnabled(groupId, enabled, meta = {}) {
  const group = ensureGroupState(groupId, meta);
  if (!group) return null;
 
  const now = Date.now();
  group.groupName = meta.subject || meta.name || group.groupName;
  group.currentQuestion = null;
 
  if (enabled) {
    group.nextQuestionAt = now + FIRST_QUESTION_DELAY_MS;
    group.nextAnnouncementAt = now + ANNOUNCEMENT_INTERVAL_MS;
  }
 
  group.updatedAt = now;
  saveSoon();
  return group;
}
 
async function handleIncomingGuess(sock, msg, extra) {
  try {
    if (!extra?.from || !extra?.sender || !extra?.body) return false;
    if (!extra.isGroup || msg?.key?.fromMe) return false;
    if (String(extra.body).startsWith(config.prefix)) return false;
    if (!isGameEnabled(extra.from)) return false;
 
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
 
    const dailyBoard = buildDailyLeaderboard(group, DAILY_LIMIT);
    const rank = dailyBoard.find((entry) => isSameUser(entry.id, player.id))?.rank || 1;
    const solvedWord = group.currentQuestion.word;
    const playerTag = mentionTag(player.id);
    const displayName = friendlyName(player.id, player.name);
 
    group.currentQuestion = null;
    saveSoon();
 
    await safeSend(sock, extra.from, {
      text: [
        '🎉 *Correct Answer!*',
        '',
        `${playerTag} guessed *${solvedWord}* first.`,
        `🏅 *Points Earned:* +${QUESTION_POINTS}`,
        `📊 *Daily Points:* ${player.dailyPoints}`,
        `🏆 *Current Rank:* #${rank}`,
        `👤 *Player:* ${displayName}`,
      ].join('\n'),
      mentions: [player.id],
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
 
function getStatus(groupId, meta = {}) {
  const group = ensureGroupState(groupId, meta);
  const enabled = isGameEnabled(groupId);
  const dailyBoard = buildDailyLeaderboard(group, DAILY_LIMIT);
  const leader = dailyBoard[0] || null;
 
  return {
    enabled,
    group,
    leader,
    nextQuestionIn: formatDelay((group.nextQuestionAt || 0) - Date.now()),
    nextAnnouncementIn: formatDelay((group.nextAnnouncementAt || 0) - Date.now()),
  };
}
 
function getStatusMessage(groupId, meta = {}) {
  const status = getStatus(groupId, meta);
  const lines = [
    '🎮 *Word Guess Game Status*',
    '',
    `👥 *Group:* ${status.group.groupName || 'Unknown Group'}`,
    `⚙️ *State:* ${status.enabled ? 'ON' : 'OFF'}`,
    `⏱️ *Next Question:* ${status.enabled ? status.nextQuestionIn : 'Disabled'}`,
    `📅 *Daily Announcement:* ${status.enabled ? status.nextAnnouncementIn : 'Disabled'}`,
  ];
 
  if (status.group.currentQuestion && status.enabled) {
    lines.push(`🧩 *Active Word:* ${status.group.currentQuestion.masked}`);
    lines.push(`💡 *Hint:* ${status.group.currentQuestion.hint}`);
  }
 
  if (status.leader) {
    lines.push(`🥇 *Current #1:* ${status.leader.displayName} - ${status.leader.dailyPoints} pts`);
  } else {
    lines.push('🥇 *Current #1:* No points yet today.');
  }
 
  if (status.group.lastReward?.winnerId) {
    lines.push(`🎁 *Last Winner:* ${status.group.lastReward.winnerName} - ${status.group.lastReward.totalPoints} pts`);
  }
 
  return lines.join('\n');
}
 
function getLeaderboardMessage(groupId, meta = {}) {
  const group = ensureGroupState(groupId, meta);
  const enabled = isGameEnabled(groupId);
  const dailyBoard = buildDailyLeaderboard(group, DAILY_LIMIT);
  const lifetimeBoard = buildLifetimeLeaderboard(group, LIFETIME_LIMIT);
  const mentions = unique([
    ...dailyBoard.map((player) => player.id),
    ...lifetimeBoard.map((player) => player.id),
  ]);
 
  const lines = [
    '🏆 *Word Guess Leaderboard*',
    '',
    `👥 *Group:* ${group.groupName || 'Unknown Group'}`,
    `⚙️ *Game:* ${enabled ? 'ON' : 'OFF'}`,
    `⏱️ *Next Round:* ${enabled ? formatDelay((group.nextQuestionAt || 0) - Date.now()) : 'Disabled'}`,
    `📅 *Daily Reset:* ${enabled ? formatDelay((group.nextAnnouncementAt || 0) - Date.now()) : 'Disabled'}`,
    '',
  ];
 
  if (group.currentQuestion && enabled) {
    lines.push(`🧩 *Active Word:* ${group.currentQuestion.masked}`);
    lines.push(`💡 *Hint:* ${group.currentQuestion.hint}`);
    lines.push('');
  }
 
  if (!dailyBoard.length) {
    lines.push('📊 *Daily Rankings:* No points recorded yet today.');
  } else {
    lines.push('📊 *Daily Rankings:*');
    dailyBoard.forEach((player) => {
      const badge = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : '▫️';
      lines.push(
        `${badge} #${player.rank} ${player.displayName} - ${player.dailyPoints} pts | answers ${player.correctAnswers}`
      );
    });
    lines.push('');
    lines.push(`👑 *Current #1:* ${dailyBoard[0].displayName} with ${dailyBoard[0].dailyPoints} pts`);
  }
 
  lines.push('');
  if (!lifetimeBoard.length) {
    lines.push('📚 *Lifetime Top:* No lifetime stats yet.');
  } else {
    lines.push('📚 *Lifetime Top:*');
    lifetimeBoard.forEach((player) => {
      lines.push(
        `#${player.rank} ${player.displayName} - ${player.lifetimePoints} pts | wins ${player.lifetimeWins || 0}`
      );
    });
  }
 
  if (group.lastReward?.winnerId) {
    lines.push('');
    lines.push(`🎁 *Last Daily Winner:* ${group.lastReward.winnerName} - ${group.lastReward.totalPoints} pts`);
  }
 
  return {
    text: lines.join('\n'),
    mentions,
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
      winnerId: reward.winnerId,
    };
  }
  if (!cleanedPack) {
    return { ok: false, code: 'missing_pack' };
  }
  if (cleanedPack.length < 2 || cleanedPack.length > 80) {
    return { ok: false, code: 'invalid_pack' };
  }
  if (reward.requestStatus === 'pending') {
    return {
      ok: false,
      code: 'already_requested',
      requestedPack: reward.requestedPack,
    };
  }
  if (reward.requestStatus === 'approved') {
    return {
      ok: false,
      code: 'already_approved',
      requestedPack: reward.requestedPack,
    };
  }
 
  reward.requested = true;
  reward.requestStatus = 'pending';
  reward.requestedPack = cleanedPack;
  reward.requestedAt = Date.now();
  reward.decidedBy = '';
  reward.decidedByName = '';
  reward.decidedAt = 0;
  reward.decisionNote = '';
  saveSoon();
 
  return {
    ok: true,
    reward,
    packName: cleanedPack,
    winnerDisplayName: friendlyName(sender, meta.pushName),
  };
}
 
function resolveReward(groupId, adminId, action, note = '', meta = {}) {
  const group = ensureGroupState(groupId, meta);
  const reward = group.lastReward;
  const normalizedAction = String(action || '').toLowerCase();
 
  if (!reward?.winnerId) {
    return { ok: false, code: 'no_winner' };
  }
  if (!reward.requested || reward.requestStatus !== 'pending') {
    return { ok: false, code: 'no_pending_request' };
  }
  if (!['approve', 'decline'].includes(normalizedAction)) {
    return { ok: false, code: 'invalid_action' };
  }
 
  reward.requestStatus = normalizedAction === 'approve' ? 'approved' : 'declined';
  reward.decidedBy = canonicalJid(adminId);
  reward.decidedByName = friendlyName(adminId, meta.adminName);
  reward.decidedAt = Date.now();
  reward.decisionNote = String(note || '').trim();
  saveSoon();
 
  return {
    ok: true,
    reward,
    action: reward.requestStatus,
  };
}
 
function getRewardStatusMessage(groupId, meta = {}) {
  const group = ensureGroupState(groupId, meta);
  const reward = group.lastReward;
 
  if (!reward?.winnerId) {
    return '🎁 *Sticker Reward Status*\n\nNo daily winner has been announced yet.';
  }
 
  const lines = [
    '🎁 *Sticker Reward Status*',
    '',
    `🥇 *Winner:* ${reward.winnerName || mentionTag(reward.winnerId)}`,
    `⭐ *Daily Score:* ${reward.totalPoints}`,
    `📈 *Rank:* #${reward.finalRank || 1}`,
  ];
 
  if (!reward.requested) {
    lines.push('📝 *Request:* No sticker pack requested yet.');
    return lines.join('\n');
  }
 
  lines.push(`📝 *Requested Pack:* ${reward.requestedPack}`);
  lines.push(`📦 *Request State:* ${reward.requestStatus.toUpperCase()}`);
 
  if (reward.decidedByName) {
    lines.push(`🛡️ *Handled By:* ${reward.decidedByName}`);
  }
  if (reward.decisionNote) {
    lines.push(`💬 *Note:* ${reward.decisionNote}`);
  }
 
  return lines.join('\n');
}
 
function getStats() {
  return {
    dbFile: DB_FILE,
    questionIntervalMs: QUESTION_INTERVAL_MS,
    announcementIntervalMs: ANNOUNCEMENT_INTERVAL_MS,
    questionPoints: QUESTION_POINTS,
  };
}
 
module.exports = {
  start,
  tick,
  syncGroups,
  ensureGroupState,
  setEnabled,
  getGroup,
  getStatus,
  getStatusMessage,
  getStats,
  getLeaderboardMessage,
  getRewardStatusMessage,
  handleIncomingGuess,
  requestReward,
  resolveReward,
};
