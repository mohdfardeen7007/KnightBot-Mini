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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VVy46jRhT9lai2tsaYl7GllgYwNviBjfEDdzSLAopHYx5dVdiGkT8h0myiURatrJNlVvMl2ecLZj4hwj093Ytk0tmg4gLnnnvOvZf3IMtjgqaoAoP3oMDxEVLUHGlVIDAAShkECIM28CGFYADY6cbu14w6Wabm3M+UOi252W6Gwz120eF4tpVdlO3HoTDib8ClDYrSPcTedwD1szdj5CpPsg5r0mXI4dkaH5RdeZ6oBS+dqnEZLvw0bA21G3BpEGGM4yzUigilCMPDFFVLGOPX0VflWjJ7ulJgIxE2OZ/t1rY0dQSOJ2WeOVK00SZpxOuWY7yOvriTA05ckZVflDXKprMOq1nEcHxUTPJVTyR3W0nI0JplpEf6JA4z5Bs+ymhMq1frjhaLjcieOGIEWq4k+tEywtFdt54MkT2UOpK9WLHTcnoeOdrriO92U6aOJcEiVeSoxzMTtjr9asFOyyRwpkd77d52JuNwHUXJS+JL/NQryf/RHerr6s71hPuunvgsUXrpYW3O91pPVo48i31IQ13NRy1n80r6NdMRmCrk7vjFcL9PxZWHIsiszHjISD6zNZKKTtZRxRv25pk+pCX+HkujS2x16hawLqK6FvKxaB2OhQyD+fi+Z8bdDTFXtmAm3Za0pme0Hq7WSq67hL9zrSRIrUQYOzyLpquxi7ai1VNH1FVPN9eKElQZPhh0L22AURgTiiGN8+wa45g2gP7RRh5G9CovYGqN03xsnEJiQtnJ3Enr5EvhRivPltOythk3slZH29W90w1ogwLnHiIE+XpMaI6rOSIEhoiAwY/v2iBDZ/poXJOO67ZBEGNCN1lZHHLoP7n69BB6Xl5m1K4yT20OCIMB8xxGlMZZSBodywxiL4qPSI0gJWAQwANB3ypEGPlgQHGJvk2tmvuN8IKwFFWZ5UAbpFdDYr+JSjwrckKfFUR2wL8lb04NKiyKNxmioA0y2LwMvjx8/OXLhw9//PXTw5+/ouv186ffP3/67eX5hy8PH3/Om68OV2xW4BlWFHiBZ0Wh1xvwb5v45VtVDQkfURgfSLMmzNjo01DRTDboS/x4LGuhrIYyeFbhqZ0e7SpvW62WyK5k/3w4Q1vnoTwjxtLsjCcFNwudc/9eEOeLWtl6N/8AAgZgdb8VFjHZ206oz+So6yh4jI2YtVwG+SEKd0JrwRp8S+2fvWghUK0/6WpHSTLzTd5fpmq4p53M2fmmvTB5ZZZ7wrpWrJsmm4+OsYdeJpv2dpvtKLqXs67T3dbc8kQ0tj/WRpOMierNrCRRld55DF5SS+IMJtIDxa9DxWBwa7bG80AoTX7nRresNLtfGROG2qJsPTb6ddAOXxdcfG3Bxt/mNojRdV98NfK//H7k3XQlc2m/gPi6gP5liBU3DY7HkiaW7t16uyRqjUO1pw7r4BxDv+JHUgBLdDckp60DLpd3bVAcIA1ynIIBIKkLQRvgvGx63MiC/Ls/k7mhyqHZVH2AhMrPc7OOU0QoTAsw6PZ6YpfnOYG7/A17us5GbQcAAA==',
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
  
