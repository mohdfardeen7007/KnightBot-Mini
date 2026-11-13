/**
 * Tag All Command - Mention all group members
 */

// Sans-Serif digits + overlay (꯭𝟢𝟢𝟣 style)
const OVERLAY = '\uABED'; // ꯭
const SS_DIGITS = ['𝟢', '𝟣', '𝟤', '𝟥', '𝟦', '𝟧', '𝟨', '𝟩', '𝟪', '𝟫'];

function fancyNumber(n) {
  // 1 -> ꯭𝟢𝟢𝟣, 12 -> ꯭𝟢𝟣𝟤, 123 -> ꯭𝟣𝟤𝟥
  const padded = String(n).padStart(3, '0');
  return OVERLAY + padded.split('').map(d => SS_DIGITS[Number(d)]).join('');
}

module.exports = {
    name: 'tagall',
    aliases: ['mentionall', 'everyone'],
    category: 'admin',
    description: 'Tag all group members',
    usage: '.tagall <message>',
    groupOnly: true,
    adminOnly: false,
    botAdminNeeded: false,

    async execute(sock, msg, args, extra) {
      try {
        const message = args.join(' ') || 'Everyone!';
        const groupName = extra.groupMetadata.subject || 'Group';

        const participants = extra.groupMetadata.participants.map(p => p.id);

        // Members list with auto-increment fancy numbers
        let members = '';
        participants.forEach((participant, index) => {
          members += `   ${fancyNumber(index + 1)}. @${participant.split('@')[0]}\n`;
        });

        // Aesthetic template
        let text = `ᅠ\n`;
        text += `   🎇   𝗧⍶ׂ𝗀ׂ𐐼Ɩ꯭Ɩ꯭   🎇\n\n`;
        text += `   𝗚𝗋𝗈𝗎𝗉      ﹕  ${groupName}\n`;
        text += `   𝗠𝖾𝗌𝗌𝖺𝗀𝖾 ﹕  ${message}\n`;
        text += `   𝗠𝖾𝗆𝖻𝖾𝗋𝗌 ﹕  ${participants.length}\n\n`;
        text += `   𝗧𝖺𝗀 𝗠𝖾𝗆𝖻𝖾𝗋𝗌\n`;
        text += `${members}\n`;
        text += `         *꯭𝟢𝟢𝟣.*\n`;
        text += `         𝝖m︩︪b︩︪𐐲፝֟𖹭︩︪𑂘e`;

        await sock.sendMessage(extra.from, {
          text,
          mentions: participants
        }, { quoted: msg });

      } catch (error) {
        await extra.reply(`❌ Error: ${error.message}`);
      }
    }
  };
