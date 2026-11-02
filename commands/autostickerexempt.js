/**
 * AutoSticker Exempt Command - Manage users that bypass auto-sticker
 */

const database = require('../../database');

const normalizeNumber = (value) => String(value || '').replace(/\D/g, '');

module.exports = {
  name: 'autostickerexempt',
  aliases: ['autoskip', 'autostickerskip', 'astickerexempt'],
  category: 'admin',
  description: 'Manage numbers that should bypass auto-sticker conversion',
  usage: '.autostickerexempt <list/add/del/reset> [number]',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: false,

  async execute(sock, msg, args, extra) {
    try {
      const settings = database.getGroupSettings(extra.from);
      const currentList = Array.isArray(settings.autostickerExcludedNumbers)
        ? settings.autostickerExcludedNumbers.map(normalizeNumber).filter(Boolean)
        : [];

      if (!args[0] || args[0].toLowerCase() === 'list') {
        const lines = currentList.length
          ? currentList.map((number, index) => `${index + 1}. ${number}`).join('\n')
          : 'No excluded numbers set for this group.';

        return extra.reply(
          `📌 *AutoSticker Exempt List*\n\n` +
          `Status: *${settings.autosticker ? 'AutoSticker ON' : 'AutoSticker OFF'}*\n` +
          `Excluded Numbers: *${currentList.length}*\n\n` +
          `${lines}\n\n` +
          `Usage:\n` +
          `  .autostickerexempt add 994401475957\n` +
          `  .autostickerexempt add 84564042619\n` +
          `  .autostickerexempt del 994401475957\n` +
          `  .autostickerexempt reset`
        );
      }

      const action = args[0].toLowerCase();

      if (action === 'add') {
        if (!args[1]) {
          return extra.reply('❌ Number do.\nExample: .autostickerexempt add 994401475957');
        }

        const number = normalizeNumber(args[1]);
        if (number.length < 8 || number.length > 15) {
          return extra.reply('❌ Invalid number format. Country code ke sath number bhejo.');
        }
        if (currentList.includes(number)) {
          return extra.reply(`*${number}* already auto-sticker exempt hai.`);
        }

        const updatedList = [...currentList, number];
        database.updateGroupSettings(extra.from, {
          autostickerExcludedNumbers: updatedList
        });
        return extra.reply(`✅ *${number}* ko auto-sticker exempt list me add kar diya.`);
      }

      if (action === 'del' || action === 'remove') {
        if (!args[1]) {
          return extra.reply('❌ Number do.\nExample: .autostickerexempt del 994401475957');
        }

        const number = normalizeNumber(args[1]);
        if (!currentList.includes(number)) {
          return extra.reply(`*${number}* exempt list me nahi hai.`);
        }

        const updatedList = currentList.filter((entry) => entry !== number);
        database.updateGroupSettings(extra.from, {
          autostickerExcludedNumbers: updatedList
        });
        return extra.reply(`✅ *${number}* ko auto-sticker exempt list se hata diya.`);
      }

      if (action === 'reset' || action === 'clear') {
        database.updateGroupSettings(extra.from, {
          autostickerExcludedNumbers: []
        });
        return extra.reply('✅ Auto-sticker exempt list reset kar di gayi.');
      }

      return extra.reply(
        '❌ Invalid option!\n' +
        'Usage: .autostickerexempt <list/add/del/reset> [number]'
      );
    } catch (error) {
      console.error('[AutoSticker Exempt Command Error]:', error);
      return extra.reply('❌ Auto-sticker exempt list update nahi ho saki.');
    }
  }
};
    
