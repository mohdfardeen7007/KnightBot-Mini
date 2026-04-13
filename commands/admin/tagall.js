const isAdmin = require('../lib/isAdmin');  

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isBotAdmin } = await isAdmin(sock, chatId, senderId);

        // ❌ Only bot admin check (user admin removed)
        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please make the bot an admin first.' 
            }, { quoted: message });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants.map(p => p.id);
        const groupName = groupMetadata.subject || 'Group';
        const memberCount = participants.length;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, { 
                text: 'No participants found in the group.' 
            });
            return;
        }

        // Stylish message
        let text = `━━━━━━━━━━━━━━━\n`;
        text += `🌴 *Attention Everyone!* ☀️\n`;
        text += `━━━━━━━━━━━━━━━\n\n`;
        text += `✦🎯✦ *Group:* ${groupName}\n`;
        text += `✦🗣️✦ *Members:* ${memberCount}\n\n`;
        text += `🌊 *Calling All Members...*\n\n`;

        participants.forEach((participant, index) => {
            text += `🏖️ ${index + 1}. @${participant.split('@')[0]}\n`;
        });

        text += `\n━━━━━━━━━━━━━━━\n`;
        text += `🌞 *Successfully tagged all members!* 💪`;

        // Send message
        await sock.sendMessage(chatId, {
            text,
            mentions: participants
        }, { quoted: message });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Failed to tag all members.\n${error.message}` 
        });
    }
}

module.exports = tagAllCommand;
