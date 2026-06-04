/**

* Tag All Command - Mention all group members
  */

module.exports = {
name: 'tagall',
aliases: ['mentionall', 'everyone'],
category: 'admin',
description: 'Tag all group members',
usage: '.tagall <message>',
groupOnly: true,
adminOnly: true,
botAdminNeeded: true,

async execute(sock, msg, args, extra) {
    try {
        const customMessage = args.join(' ');
        const participants = extra.groupMetadata.participants.map(p => p.id);

        const groupName = extra.groupMetadata.subject || 'Group';
        const memberCount = participants.length;

        if (!participants.length) {
            return extra.reply('❌ No participants found in the group.');
        }

        let text = `━━━━━━━━━━━━━━━\n`;
        text += `🌴 *Attention Everyone!* ☀️\n`;
        text += `━━━━━━━━━━━━━━━\n\n`;
        text += `✦🎯✦ *Group:* ${groupName}\n`;
        text += `✦🗣️✦ *Members:* ${memberCount}\n\n`;

        if (customMessage) {
            text += `💬 *Message:*\n${customMessage}\n\n`;
        }

        text += `🌊 *Calling All Members...*\n\n`;

        participants.forEach((participant, index) => {
            text += `🏖️ ${index + 1}. @${participant.split('@')[0]}\n`;
        });

        text += `\n━━━━━━━━━━━━━━━\n`;
        text += `🌞 *Successfully tagged all members!* 💪`;

        await sock.sendMessage(
            extra.from,
            {
                text,
                mentions: participants
            },
            { quoted: msg }
        );

    } catch (error) {
        console.error('TagAll command error:', error);
        await extra.reply(`❌ Error: ${error.message}`);
    }
}

};
