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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU25KiSBD9l3rVGLkpYERHLKBiqaiogLIxDyUUUHIVShEm/PcN+rLdD7uzvTwlWVmZJ0+eyl8gy0mFl7gB41+gKMkdUdyZtCkwGAP1FgS4BH3gI4rAGPQ2ubrfPkZzv73Jl4FQOFwM03kWsTNhMXjw8QSefKgpexa+gGcfFLdzQrzfJJzIxVk+MA94rIb8jc/iY7OTrig/JptTG64cfTsIveRsRanwAp5dRkRKkoXTIsIpLlGyxM0WkfJ78OuZE624u3e6SIN2YLmOv4imSF3gg6C4RS+w7bII14fEiOPvwa8chNs9DNt9ss60S9zmgepsJ2bTQ/LyGh4vLWuKLjJ1vn6DX5Ewwz70cUYJbb7N+whe+N20dq1T5LjNOmR7S3gZ8PHxvN43MF0tcehbgXAq2fp7wBmrrmG149aMvghWy2UUWa0ocI4oB6t4Z8H66g3h2ZgZOvwKfFt+aCX+P7xrq+V9l/UG1L4RqFhEeTRmPlqwkrUqWruptybSy1L3Zsk34UtlvCh8TtuSKgxkhm+mRcQ7D1Xr2dalaI1mloaTbcDPWfMTPqK38nco0epoJ7CtbXGGKzMy9lOtOa3iZKlfCdR358JQJdjy/E6JFbozJura30eqUFpmT1Il38WmLd9H7qMNFNc1UhEOR7aqvLx2FOMG+mDMPvugxCGpaIkoybPOxzHDPkD+fY+9EtNXekH4iCYjQ5nWvMHGvUqzmHph2RtGS/TDJNTp5Dhyp4ZPpMX0BfRBUeYerirsz0lF87IxcFWhEFdg/OfPPsjwg74NrivHs30QkLKiVnYrkhz5H1P9OESel98yum8yT+sMXIIx8+nGlJIsrDoebxkqvYjcsRYhWoFxgJIK/90hLrH/7uuDMr9112AW5L/TiQqhaobrjrH3el20jykiSdUFQOfUw3Ay3XKVKCu6rkxDRQsV8InvY9BvRB54a7sZogN7nau7eJauVjMuH1wv7cWCw3wOD3s7z/XdXNOrl39IAsbgbmy4c2HgoMDeAS/kZCQLsnmayWTBwAee9rCf1YTR1ZO41TYuUixDqSinNkKoD+9xYhaqp9f33iG9uim+2vsasVr90lXz8Z14+Gsxp10elhvGsEXNNq/izZnRjBPgdkhoY2/pSfH3k8lqfVxWfn7XSqG9SYJph71a2NziUwirsxjd/XsTKWuJc/TNToecUr9JMH3VPvHBGHDccCiJHM8w8nj0R/Wj7uaHiuJHhinogwx1sSDCSZKDPkhe77DikOFFachxndXd6/wfTyt5X2nkVXRdme43IPh1Q7wn/I+yb3R0MmSe/S8Z3jfOv2hGtWR20t6cWEZRbbmqS5qHf92OcklgtQ1SmymToKUa7+qoBM/nzz4oEkSDvEy7/Z2eUdchqqjyKfsDSXFFUVqAMStKDMfInDTsg7RRimJPEf14LUDpvmk6A8+/AHjoqDpJBwAA',
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
  
