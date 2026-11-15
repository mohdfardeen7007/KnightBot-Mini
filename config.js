/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['919517641203'], // Add your number without + or spaces (e.g., 919876543210)
    ownerName: ['𝗔𝗆𝖻𝗋𝗈𝗌𝖾'], // Owner names corresponding to ownerNumber array
    
    // Bot Configuration
    botName: '𝗔𝗆𝖻𝗋𝗈𝗌𝖾',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUTY6jRhS+SlRbW9MYDNhILQ3GGGMb8D/Y0SzKUEC5ocBFYTceeZEoWSWLURbpVa+iHCD7nCE5Q27QR4jonp6eRTLpsKHqgb73ve97770HJMMFGqMKKO9BTvERMlQfWZUjoIBeGYaIgiYIIINAASd1bu9gaE2NiAy1DSeeiLzjonw9omuR7Yute9LVk9eNheIaXJogL3cJ9r8AODhk7r7SLZQ507K7RK2TPneIZQ/Z2k32gd+Wyqk4GaRy3LkGlxoRYopJpOcxShGFyRhVU4jp6+jjsTnPHEOysbR0+MNqo3LWlp9P+b3PyMLsbTcl3XKT3G/pr6Mvi/wVMTmvYY4gFbZHUeYyVPFMymNeHrT61VCPq/l0QXT9iX6BI4ICM0CEYVa9WvfOYOQY89bMuEqqhiNYy9k4m0462W7i+dVsOYmZLwsY+uPWzeuIW7jw+kZb9+PhwRrM9LBrxHRr95xlX+1mxCPi4hjP1tRJOp8Tn9LnXrn5P7qP9Vs7P5Ob8dmzqomfZ7IebiXXwKbTSEwu3eiqbCKtgsbmdfRVB/I2beS27lq2Xpx6FdU0thcsHZGTnEfDm70npHo2Sk4v9CEr6ZdYbhnrj0ZZqMredkG0OPJkOM7OzkhaDAfFcbTU+OnWLrEs7TQ+IeUqnk5zqsXxyuM3hTudLNtpGR6kpYuQ0GjBVixvetH1Y0U3qDIDoLQuTUBRhAtGIcMZqWM8324CGBwXyKeIPcoLhtpuVHCqRQe3je1O6I1WaVCMq1Yf68TeWQdxck6GDb0b35yuQRPkNPNRUaBgiAuW0cpCRQEjVADl63dNQNAtezKuTie0miDEtGArUuZJBoNnV58/Qt/PSsIWFfG1+oAoULiXMGIMk6iodSwJpH6Mj0iLISuAEsKkQJ8qRBQFQGG0RJ+mVsuCWnhvtDXcRbcNmiB9NAQHQAFdWe7KEi/wgtiVlfbb4s2phoV5/oYgBpqAwPpv8HD/4aeH+7tvH+7vfqjff37/cH/341cP9x+++evXX/747eH+598f7u++A02QPAJ3OlKba3NyW+60W22l/bYOXz5VVBMIEIM4KYACNMs7kE7U000pF7u+Yah6pGqRCl4UeG6lJ6tst+jFbl6J6oY1prYgVeqiFEyBc0S1nCwbo9jQo7S7iXj/+h9AgAJEaS22Kpb1Ik9vyQd62t3utzx1+UY/H7r5suDW8xQf1YNYoiPFkWudx9wo0a4CvLIO3iqaG7OFPKbS2fXau9nQCA4z7XRdZwvQEfvo82TD3pUz1byBH9qLdSWwUCs7cuCc9/PtIRVSYSM1YpZaNwsrnfelNHeEfgcFSXWVksBP+WzEx5DX151GoTpklXRKsuZU9anJH4cs+bjc8GP71d7W1xCjx13x0cP/9PqJeN2S3KX5GcbH7fMvE9xbrqm6WR/8cmZMwv05aBSRTllld/vlbIK5K7yZx+bo6Jo2AZfLuybIE8jCjKZAAUW6g6AJaFbWDW6SMPtCJk2zzP4sMuuyE1gw9WVoljhFBYNpDpSW3G3LoizL3SZIKzXPFwyy51kDav3YaAEufwM2ImiThwcAAA==', //Paste your session here 
    newsletterJid: '120363161513685998@newsletter', // Newsletter JID for menu forwarding
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip', // URL to latest code zip for .update command
    
        // Sticker Configuration
        packname: '𝗔𝗆𝖻𝗋𝗈𝗌𝖾',
    
        // Bot Behavior
        selfMode: false, // Private mode - only owner can use commands
        autoRead: false,
        autoTyping: false,
        autoBio: false,
        autoSticker: false,
        autoReact: false,
        autoReactMode: 'bot',
        autoDownload: true, // Auto-download social media links (insta/tiktok/pinterest/fb/x) without a command
        
        // Group Settings Defaults
        defaultGroupSettings: {
          antilink: false,
          antilinkAction: 'delete', // 'delete', 'kick', 'warn'
          antitag: false,
          antitagAction: 'delete',
          antiall: false, // Owner only - blocks all messages from non-admins
          antiviewonce: false,
          antibot: false,
          antibotAction: 'warn', // 'warn' | 'kick'
          anticall: false, // Anti-call feature
          antigroupmention: false, // Anti-group mention feature
          antigroupmentionAction: 'delete', // 'delete', 'kick'
          antigroupstatus: false, // Block group status posts
          antigroupstatusAction: 'delete', // 'delete', 'kick'
          antisticker: false, // Stickers not allowed in group
          antistickerAction: 'delete', // 'delete', 'kick'
          antibadword: false, // Block bad words in group
          antibadwordAction: 'delete', // 'delete', 'kick', 'warn'
          welcome: false,
          welcomeMessage: '╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @user 👋\n┃Member count: #memberCount\n┃𝚃𝙸𝙼𝙴: time⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@user* Welcome to *@group*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\ngroupDesc\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ botName*',
          goodbye: false,
          goodbyeMessage: 'Goodbye @user 👋 We will never miss you!',
          antiSpam: false,
          antiSpamAction: 'warn', // 'warn' | 'kick'
          antidelete: false,
          detect: false,
          chatbot: false,
          suppress: false, // Members get no command reply; owner and admins still can
          autosticker: false // Auto-convert images/videos to stickers
        },
    
    // API Keys (add your own)
    apiKeys: {
      // Add API keys here if needed
      openai: '',
      deepai: '',
      remove_bg: '',
      telegram: '9009049462:AAEze4-5Ot0xtFr0CYJjd9fSqQN_Pzd6LQU' // @BotFather token — required for .tg / .tgsticker
    },
    
    // KnightBot Mini media API (song/video/tiktok/facebook downloaders)
    // Optional backup host via YT_API_FALLBACK_URL (none by default)
    mediaApiUrl: (process.env.YT_API_URL || 'https://knightbotapi.stream').replace(/\/$/, ''),
    mediaApiFallbackUrl: (process.env.YT_API_FALLBACK_URL || '').replace(/\/$/, ''),
    mediaApiKey: process.env.YT_API_KEY || process.env.KNIGHT_API_KEY || 'knight',
    // KnightBot public API (reactions GIFs, etc.)
    knightApiUrl: (process.env.KNIGHT_API_URL || 'https://knightbotapi.stream').replace(/\/$/, ''),
    knightApiKey: process.env.KNIGHT_API_KEY || 'knight',
    princeApiUrl: (process.env.PRINCE_API_URL || 'https://api.princetechn.com').replace(/\/$/, ''),
    princeApiKey: process.env.PRINCE_API_KEY || 'prince',

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
      instagram: 'https://instagram.com/kngightbotmd',
      youtube: 'http://youtube.com/@mr_unique_hacker'
    }
};
  
