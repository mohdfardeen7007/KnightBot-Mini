/**
 * Menu Command - Display all available commands
 */

const config = require('../../config');
const { loadCommands } = require('../../utils/commandLoader');

module.exports = {
  name: 'menu',
  aliases: ['help', 'commands'],
  category: 'general',
  description: 'Show all available commands',
  usage: '.menu',
  
  async execute(sock, msg, args, extra) {
    try {
      const commands = loadCommands();
      const categories = {};
      
      // Group commands by category
      commands.forEach((cmd, name) => {
        if (cmd.name === name) {
          if (!categories[cmd.category]) {
            categories[cmd.category] = [];
          }
          categories[cmd.category].push(cmd);
        }
      });
      
      const ownerNames = Array.isArray(config.ownerName) ? config.ownerName : [config.ownerName];
      const displayOwner = ownerNames[0] || config.ownerName || 'Bot Owner';
      
      let menuText = `╭━━『 *${config.botName}* 』━━╮\n\n`;
      menuText += `👋 Hello @${extra.sender.split('@')[0]}!\n\n`;
      menuText += `⚡ Prefix: ${config.prefix}\n`;
      menuText += `📦 Total Commands: ${commands.size}\n`;
      menuText += `👑 Owner: ${displayOwner}\n\n`;

      // Function to add commands by category
      const addCategory = (emoji, title, cmds) => {
        if (!cmds) return;
        menuText += `┏━━━━━━━━━━━━━━━━━\n`;
        menuText += `┃ ${emoji} ${title.toUpperCase()} COMMAND\n`;
        menuText += `┗━━━━━━━━━━━━━━━━━\n`;
        cmds.forEach(cmd => {
          menuText += `│ ➜ ${config.prefix}${cmd.name}\n`;
        });
        menuText += `\n`;
      }

      addCategory('🧭', 'General', categories.general);
      addCategory('🤖', 'AI', categories.ai);
      addCategory('🔵', 'Group', categories.group);
      addCategory('🛡️', 'Admin', categories.admin);
      addCategory('👑', 'Owner', categories.owner);
      addCategory('🎞️', 'Media', categories.media);
      addCategory('🎭', 'Fun', categories.fun);
      addCategory('🔧', 'Utility', categories.utility);
      addCategory('👾', 'Anime', categories.anime);
      addCategory('🖋️', 'Textmaker', categories.textmaker);

      menuText += `╰━━━━━━━━━━━━━━━━━\n\n`;
      menuText += `💡 Type ${config.prefix}help <command> for more info\n`;
      menuText += `🌟 Bot Version: 1.0.0\n`;

      // Send menu with image if exists
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '../../utils/bot_image.jpg');
      
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        await sock.sendMessage(extra.from, {
          image: imageBuffer,
          caption: menuText,
          mentions: [extra.sender]
        }, { quoted: msg });
      } else {
        await sock.sendMessage(extra.from, {
          text: menuText,
          mentions: [extra.sender]
        }, { quoted: msg });
      }
      
    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  }
};
