/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['91xxxxxxxxxxx','919517641203'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['𝝖m︩︪፝֟b︩︪𐐲፝֟𖹭︩︪𑂘e︪︩፝֟', '𝝖m︩︪፝֟b︩︪𐐲፝֟𖹭︩︪𑂘e︪︩፝֟'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: '𝝖m︩︪፝֟b︩︪𐐲፝֟𖹭︩︪𑂘e︪︩፝֟',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUza7aRhR+lWq2oOBfMEhXim0MGDAGDFxwlcXYHpvBv3c8tjERj1ApmyrqIuq6XXaVJ+m+T5A8QmVubnIXbXq7scZn7O985/vOOW9BkuIczVANBm9BRnAJKWqOtM4QGACl8H1EQBt4kEIwAJyiHznf5KmL2dbBF2ufJMEQz+bVsDis+BBN5mnYPevOXroD1zbICifC7ncAq92pC63eJTxpeaTFZCqRZWeWWPsJdFrhGdHtAz+b7wI4ZO7AtUGEmOAk0LIjihGB0QzVS4jJy+jfy0dzsaxm9BBVs4ej6Hhxmo1Zo3vvSWjRt1dY6fmjM5/x1cvox5MA2RtzwgYpz2itM9+6L+1EVYfS2oTMw0hfz3S28IfztfBIP8dBgjzdQwnFtH6x7l2joz5IO8cSojW3IEN7oWpDTiv9WeX1+OPoXlyXiRA49y8lntu2qBRjo+J1qJiUiBe2jJw1Ws7IcVZPpOgiqWmhLSAOnxNfkqdeCf+P7qG+0d3jsNyOumlStjpVWoVM5dmXCFpbKT71gvU6XmNJ3OYvo7/RZNtFS9UcZ2V9EKLhWI5qwyj1UdHCmuBU04l83jF1pDyjD2lBvsfyVLbWkFWmwUg2JtvzjtfTRFY302Grsx1b+nws93jEW+O9Qs3l3Flo1tpxTGyoray/6x9HWp4tFhN9WOWd1lnWdzibJqfV3a2iENW6BwbstQ0ICnBOCaQ4TW4xTmwD6JUWcgmiN3mBOx+rRtfOWc1bYOG8UuBpzy9SxxeSuY5cZrrFmsBG+cp070AbZCR1UZ4jb4JzmpLaQHkOA5SDwY9v2iBBZ/poXJOOZ9vAxySn26TIohR6T64+XULXTYuEWnXiqs0BETBgvoURpTgJ8kbHIoHEPeISqUdIczDwYZSjrxUigjwwoKRAX6dWTb1G+Huh1x/Jah+0QXwzBHtgAERJ4Lq82OfELjfgX+evqgYVZtmrBFHQBglsPgafP7z/5fO7d3/89dOHP39Ft+enj79/+vjb8/MPnz+8/zlt/opu2JwoMFxXFESB64q93oB/3cSvX6tqSHiIQhzlYADUBdL7NFC0Zb3vG8J4LGuBrAYy+KbCUzs92pUpqiBZvdVBPPVnZ1dd67M6dDqLzE0UU+1zB4VuJxY0Rpft3T+AgAHwPA/akq3a3nqy53zEddQRtlZHI4zgyiPGVputoFOSw5DQOCoNtxVsRnVBvIedcpKIFHZsrOw7G43zVx1m2TrMmZES3DXZPFRiFz1Pdt6p/bCyeyzlNmbhBBFHSin0ElUjPO24YbB2aXfZ5bhjcNpLWjgdp8LcZCI2FsvktEku9bBIL7w8jDWB3k9aJlu1guqx0W+DFn1ZcPjWgo2/zauP0W1ffDHyv/x+5N10JXNtP4P4soD+ZYgVuFoVS61gxuahY+V7ObTUPBt3LnA/rTZB6cWys1OY+KS4LLhe37RBFkHqpyRutmLsQNAGJC2aHtcTP/1OJlU2dFUOFk3VEcyp/G1uNjhGOYVxBgZsr9dl+gLH9K9/A2tFSA9tBwAA',
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
    // Sticker Configuration
    packname: '𝝖m︩︪፝֟b︩︪𐐲፝֟𖹭︩︪𑂘e︪︩፝֟',
    
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
  
