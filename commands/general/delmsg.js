/**
 * Delete Command - Delete multiple recent group messages
 * Place this file in commands/admin/delete.js
 */
const { findParticipant } = require('../../utils/jidHelper');
 
const MAX_DELETE = 20;
 
function isAdminParticipant(participant) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin';
}
 
function toTimestamp(message) {
  const value = message?.messageTimestamp;
 
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
 
  if (value && typeof value === 'object') {
    if (typeof value.low === 'number') return value.low;
    if (typeof value.toNumber === 'function') {
      try {
        return value.toNumber();
      } catch (error) {
        return 0;
      }
    }
  }
 
  return 0;
}
 
function isDeletableMessage(entry, chatId) {
  if (!entry?.key?.id || !entry?.key?.remoteJid) return false;
  if (entry.key.remoteJid !== chatId) return false;
  if (!entry.message) return false;
  if (entry.message.protocolMessage) return false;
  return true;
}
 
function buildDeleteKey(key) {
  const deleteKey = {
    remoteJid: key.remoteJid,
    id: key.id,
    fromMe: !!key.fromMe,
  };
 
  if (key.participant) deleteKey.participant = key.participant;
  if (key.participantAlt) deleteKey.participantAlt = key.participantAlt;
 
  return deleteKey;
}
 
module.exports = {
  name: 'delete',
  aliases: ['purge', 'delmsg', 'clearmsg'],
  category: 'admin',
  description: 'Delete multiple recent messages from the group',
  usage: '.delete <count>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,
 
  async execute(sock, msg, args, extra) {
    try {
      const requestedCount = Number.parseInt(args[0], 10);
 
      if (!Number.isInteger(requestedCount) || requestedCount < 1) {
        return extra.reply(
          '❌ Please provide a valid number of messages to delete.\n\nExample:\n.delete 5\n.delete 20'
        );
      }
 
      const chatId = extra.from;
      const sender = extra.sender || msg.key.participant || msg.key.remoteJid;
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata?.participants || [];
 
      const senderParticipant = findParticipant(participants, sender);
      if (!senderParticipant || !isAdminParticipant(senderParticipant)) {
        return extra.reply('❌ Only group admins can use this command.');
      }
 
      const botParticipant = findParticipant(
        participants,
        [sock.user?.id, sock.user?.lid].filter(Boolean)
      );
 
      if (!botParticipant || !isAdminParticipant(botParticipant)) {
        return extra.reply('❌ I need admin rights to delete group messages.');
      }
 
      const chatMessages = sock.store?.messages?.get?.(chatId);
      if (!chatMessages || chatMessages.size === 0) {
        return extra.reply('❌ No recent cached messages were found for this group.');
      }
 
      const cacheLimit = Math.min(sock.store?.maxPerChat || MAX_DELETE, MAX_DELETE);
      const targetCount = Math.min(requestedCount, cacheLimit);
 
      const recentMessages = Array.from(chatMessages.values())
        .filter((entry) => isDeletableMessage(entry, chatId))
        .sort((a, b) => toTimestamp(b) - toTimestamp(a))
        .slice(0, targetCount);
 
      if (recentMessages.length === 0) {
        return extra.reply('❌ No recent messages are available to delete right now.');
      }
 
      let deletedCount = 0;
      let failedCount = 0;
 
      for (const recentMessage of recentMessages) {
        try {
          await sock.sendMessage(chatId, {
            delete: buildDeleteKey(recentMessage.key),
          });
          deletedCount++;
        } catch (error) {
          failedCount++;
        }
      }
 
      if (deletedCount === 0) {
        return extra.reply(
          '❌ Failed to delete recent messages. Make sure they are still revocable and that I am a group admin.'
        );
      }
 
      let response = `✅ Deleted ${deletedCount} recent message${deletedCount === 1 ? '' : 's'}.`;
 
      if (requestedCount > cacheLimit) {
        response += `\n⚠️ This bot can only access the last ${cacheLimit} cached messages in a chat.`;
      }
 
      if (failedCount > 0) {
        response += `\n⚠️ ${failedCount} message${failedCount === 1 ? '' : 's'} could not be deleted.`;
      }
 
      await sock.sendMessage(chatId, { text: response });
    } catch (error) {
      console.error('Delete command error:', error);
      await extra.reply(`❌ Failed to delete recent messages: ${error.message}`);
    }
  },
};
