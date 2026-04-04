/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['91xxxxxxxxxxx','919517641203'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['Knight Bot Mini', 'Professor'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: 'Knight Bot Mini',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUXY+iSBT9L/WqGQEF0aSTRUBFERX83uxDSRVQ8mlVAU1P/O8b7OnpySY728tTcevm3nPPPae+gywnDC9xA8bfQUFJBTluj7wpMBiDSRkEmIIuQJBDMAaCA7myjPtwcDqfbuUd2avq7F1WK1fnzv6ItOxEgnnvlJjbF/DogqK8JsT/TcFqI+BM7sXUcoXj8U2qdpF8XMeN4O6q4Sy+T81TMbVHfjkVXsCjrQgJJVloFhFOMYXJEjcbSOjX4HuTYB7ITaSutwc/OzZWWC5M+8bd08Y52r2eGfMsEgaKKuVfgw8pCVLTOSArX9jKdULE3eSmoI52dOKRdG76xPEr16u8/vYdPiNhhpGFcMYJb77Mu2KFQWWspitabuTtES4tfbA8uHcB9WAuKWKsa6xT8hvK/K8BZ25qrtJhWWZmgTqCa3XQTuOvfc3wX+mViLeZhqlhvZqv2q/AN/RDK/H/4V01OuvcWmAnVqdkflpQ3jmw86h5q+5LV8/8wrtut8HEXs/qL/I+OxumikrjFmebe62eN+Xxoo5udrm/dSJEOlXvgpNQqaXwEz7kJf0dysoZ5BXdNLticcG6dNIdzbZ29FAoNlofc9EW9elmKCxPmS3UxVxPVjfvst8Lt31IF5LDxNmuzrf6yFwql7qR1ru34dskfHlOFOPGQmAsPrqA4pAwTiEnefaMCUoXQFR52KeYP+kFF+EuMJMrb87dgLGZGvVrc7h14jOa6bOzcllUfui6JJnk8QvogoLmPmYMozlhPKfNCjMGQ8zA+M+/uiDDr/x9cW27vtgFAaGM77OySHKIPrb6cQl9Py8z7jWZr7cHTMFY+AxjzkkWspbHMoPUj0iF9QhyBsYBTBj+OSGmGIExpyX+6Vo9Ry3x6uliqP3zCXRB+lwIQWAMRqIqSkN1KI+G0lgd/cG+1W1ZWBTfMsxBFyTPNHEgC4I0HPVVRRoM2sQ2/vgJsK2HMIckYWAM9IUedZgwMRclqdXBbKaZoaaHGvgc6EMZ78zb+xo311Mq41B1THItLmTFJDK36YHIh77B9EyeypN6tn0y/88irYwMT4vEw2KaFBqyFoM+tMymDKLK2xShv1qHEF8Hpp07uBzul/MjOlrpXbhjcb005oV5sJPpnK8bymQ4mbG7t+vtVGP70nZDuCI+/rWZ05zvs/wqBNM4tBdNM5p722YdGeuBNeLJvpr13ONIprWd+USIAu/VVy7Odj7i1T49zyzlerfVlXzx1shVlbDwN5HJjPpds0/PJD/eKvJUU7uq9jcg+Gn9DLYL/O/VvQNvFSY8ur/U+PGY/IshJ564mrNUlMtTvjFcK1WO55vt5FGjiOfygOqhVnRcvPUn8QI8Hn91QZFAHuQ0bZ+IDNGcINAFNC9byVpZkP+mmT6xrMk2tNrJE8i49mmDHUkx4zAtwFgcDmVpJA2F/nvWhubFHLIIjEE/TcSb12q60YrC45B/uApo7besL+DxN5FHu6pxBwAA',
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: 'Knight Bot Mini',
    
    // Bot Behavior
    selfMode: false, // Private mode - only owner can use commands
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: 'bot', // set bot or all via cmd
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: false,
      antilinkAction: 'delete', // 'delete', 'kick', 'warn'
      antitag: false,
      antitagAction: 'delete',
      antiall: false, // Owner only - blocks all messages from non-admins
      antiviewonce: false,
      antibot: false,
      anticall: false, // Anti-call feature
      antigroupmention: false, // Anti-group mention feature
      antigroupmentionAction: 'delete', // 'delete', 'kick'
      welcome: false,
      welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
      goodbye: false,
      goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false // Auto-convert images/videos to stickers
    },
    
    // API Keys (add your own)
    apiKeys: {
      // Add API keys here if needed
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: '👑 This command is only for bot owner!',
      adminOnly: '🛡️ This command is only for group admins!',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: '🤖 Bot needs to be admin to execute this command!',
      invalidCommand: '❓ Invalid command! Type .menu for help'
    },
    
    // Timezone
    timezone: 'Asia/Kolkata',
    
    // Limits
    maxWarnings: 3,
    
    // Social Links (optional)
    social: {
      github: 'https://github.com/mruniquehacker',
      instagram: 'https://instagram.com/yourusername',
      youtube: 'http://youtube.com/@mr_unique_hacker'
    }
};
  
