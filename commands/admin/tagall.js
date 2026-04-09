/**
 * Tag All Command with Group Info
 */

module.exports = {
    name: 'tagall',
    aliases: ['mentionall', 'everyone'],
    category: 'admin',
    description: 'Tag all group members with info',
    usage: '.tagall',
    groupOnly: true,
    adminOnly: false,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, extra) {
        try {
            const participants = extra.groupMetadata.participants.map(p => p.id);
            const groupName = extra.groupMetadata.subject || 'Group';
            const memberCount = participants.length;
            
            let text = `━━━━━━━━━━━━━━━\n`;
            text += `🌴 *𝝖ᨡj ᨡtte︪︩፝֟nꛆᨡnc፝֟e︪︩፝֟ nᨡჩ︪︩iꨪ ꛆiꨪ t𖹭︩︪ჩ︪︩ nᨡᨡm︩︪፝֟ ჩ︪︩iꨪ𑂘t𖹭︩︪𐐲፝֟ɥ፝֟ b︩︪ᨡn jᨡɥ፝֟e︪︩፝֟ᧁ፝֟ᨡ 🪦* ☀️\n`;
            text += `━━━━━━━━━━━━━━━\n\n`;
            text += `✦🎯✦ *𝗚𐐲፝֟𖹭︩︪up:* ${groupName}\n`;
            text += `✦🗣️✦ *𝝡e︪︩፝֟m︩︪፝֟b︩︪e︪︩፝֟𐐲፝֟𑂘:* ${memberCount}\n\n`;
            text += `🌊 *𝗖ᨡlliꨪnᧁ፝֟ 𝝖ll 𝝡e︪︩፝֟m︩︪፝֟b︩︪e︪︩፝֟𐐲፝֟𑂘...*\n\n`;
            
            participants.forEach((participant, index) => {
                text += `🏖️ ${index + 1}. @${participant.split('@')[0]}\n`;
            });
            
            text += `\n━━━━━━━━━━━━━━━\n`;
            text += `🌞 𝗦uc፝֟c፝֟e︪︩፝֟𑂘𑂘 𝗨nჩ︪︩iꨪ 𝗞𖹭︩︪ 𝝡iꨪltiꨪ 𝗛ᨡiꨪ 𝗝𖹭︩︪ 𝗚c፝֟ 𝝡e︪︩፝֟iꨪ 𝝖c፝֟tiꨪv︪︩፝֟e︪︩፝֟ 𝗥e︪︩፝֟ჩ︪︩tჩ︪︩e︪︩፝֟ 𝗛ᨡiꨪ 💪! 🕶️`;
            
            await sock.sendMessage(extra.from, {
                text,
                mentions: participants
            }, { quoted: msg });
            
        } catch (error) {
            await extra.reply(`❌ *Oops!* Something went wrong:\n${error.message}`);
        }
    }
};
