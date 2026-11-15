/**
 * AutoDownload Command - Enable or disable automatic media-link downloading
 */

const database = require('../../database');
const autoDownload = require('../../utils/autoDownload');

const PLATFORM_LIST = autoDownload.PLATFORMS.map((p) => p.platform).join(', ');

module.exports = {
  name: 'autodownload',
  aliases: ['autodl', 'adl', 'autodownloader'],
  category: 'admin',
  description: 'Enable or disable automatic download of media links (no command needed)',
  usage: '.autodownload <on/off/reset>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const opt = (args[0] || '').toLowerCase();

      if (!opt) {
        const settings = database.getGroupSettings(extra.from);
        const enabled = autoDownload.isEnabled(settings);
        const mode = typeof settings.autodownload === 'boolean' ? 'custom' : 'default';
        return extra.reply(
          `📥 *AutoDownload Status*\n\n` +
          `Status: *${enabled ? 'ON' : 'OFF'}* (${mode})\n\n` +
          `When ON, links from these platforms are downloaded automatically — no command needed:\n` +
          `${PLATFORM_LIST}\n\n` +
          `Usage:\n` +
          `  .autodownload on\n` +
          `  .autodownload off\n` +
          `  .autodownload reset`
        );
      }

      if (opt === 'on' || opt === 'enable') {
        if (database.getGroupSettings(extra.from).autodownload === true) {
          return extra.reply('*AutoDownload is already ON*');
        }
        database.updateGroupSettings(extra.from, { autodownload: true });
        return extra.reply(
          `✅ *AutoDownload turned ON*\n\nLinks will now be downloaded automatically.\nPlatforms: ${PLATFORM_LIST}`
        );
      }

      if (opt === 'off' || opt === 'disable') {
        if (database.getGroupSettings(extra.from).autodownload === false) {
          return extra.reply('*AutoDownload is already OFF*');
        }
        database.updateGroupSettings(extra.from, { autodownload: false });
        return extra.reply('❌ *AutoDownload turned OFF*');
      }

      if (opt === 'reset' || opt === 'default') {
        database.updateGroupSettings(extra.from, { autodownload: undefined });
        const enabled = autoDownload.isEnabled(database.getGroupSettings(extra.from));
        return extra.reply(`♻️ *AutoDownload reset to default* (${enabled ? 'ON' : 'OFF'})`);
      }

      return extra.reply('❌ Invalid option!\nUsage: .autodownload <on/off/reset>');
    } catch (error) {
      console.error('[AutoDownload Command Error]:', error);
      return extra.reply('❌ Error updating autodownload setting.');
    }
  },
};
