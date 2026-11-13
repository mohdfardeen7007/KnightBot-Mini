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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VUTbOiSBD8L32FGEFQgYgXMYCAKCooirgxB4QGGhGwaVCc8L9v8D5m3mF39u2tKSArKzOrf4KiRDVcwA5IP0GFURsQ2B9JV0EgAaWJY4gBDaKABEAC29WRVwTP3FuTkyvbWugT7hLKqbwoz8VmmqkNQSTj7gFrvoAnDarmlKPwD4BsknFuQQlmRpQ0SkfdsRraXOzfnITw2cPaPSpqM81la++8gGePGCCMikSrUniBOMgXsLMDhL9Gv5ydzPWBdbHDC9x8ioxVJPN8t9jPrpTLqVnGt15NDIdjhK/RPwgx3DJ6PFo7S0YJI9Mf2uoxcmxqRW0KXZV32IvXuq4h+Y1+jZICRmYEC4JI92XdDSWVYV6evOtuk6KjvLnL4ekwsmbegonFa3Yd7cc5g/WlznyNeDVxufA89iZnbsNG/u3utqfy+rhmzDjh+PFulVJtlXPDW+Z8Jm7jj6yc/4/uO90UuYHG3QlOiuVmfZSvzrWqj7I8rTsjo/Q10zHuiTvlydfoOwzaL2Yqvi9LpnDQoqB03tStRG4GJhroj92AZ1WPY1T3k+4BafCfWDbWbud3lI+5RzHXjoqHi0XpMPpIl42DcCgNsQzT1KRyd1l00JtfF8ymnk+VRXqfGdQAR1gsu4Rh9VTVk1Ib7++hP01eXic6w86MgMQ+aYBhgmqCA4LKoq9NxjQIonYLQwzJq7rgXMfhcRsufYpU1Z3Xt0rpz29HA186HOS+Bz0K6uVtsbzcXgANKlyGsK5hNEM1KXG3hHUdJLAG0l8/aFDAO3nzre/GsTSIEa7JrmiqvAyiD1M/XgZhWDYF2XZFqPYHiIHE/C5DQlCR1L2MTRHgMEUtVNOA1ECKg7yGvwaEGEZAIriBv5ZWLaNe96Fm+9ZGXwAaXF79QBGQgDiZiJPxkBtyI3Eisd/rb7ceNqiqbwUkgAZF0H8N4gBHEBaABvnrf4Iw5hmemfATgWd5if3el5+/CPf4ESQBymsgAXVpXQshUTSrTYckNAxZS2Q1kcHvAT+C8ubEyquV1Ku6kewTyl5x407eNpzJMeuR3FguNU8NLbmIfjIMX/4BBEggXLptnoj2eL9tvYN1mKGamqrUjH8gxo542TCn7HErTIcos6nlyhI8fbg6UceVrpyv+v1czr0lbt0UEy8VrsP5XtOmSp8qGkSwRSH83IwKB8nZNgRta1qtPdcpbJbtZXbWq6swSut7dVNuRuTah3a2TihdDM/MQNhEGWOXO0g550t6EitN1U9mNfX9nINGXqnvEX5dofz96kKv6eqt6x9jBF9vgneL/tPKN+J94pgn/Qnj/W75l/1U3D2W/f01bBzDirNHRNWJhkm3EqeNYyFmgPxNas5bz1wV4Pn8QYMqD0hc4guQQH05BYAGuGz6/JpFXP6hk6ouzamTmP3YeVAT+fdOuOgCaxJcKiCxE5EfjVhRFJ9/A4I/QctIBwAA', //Paste your session here 
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
  
