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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU25KiSBD9l3rFGAGlQSM6YgVREG8ooLIxDyUUUIDFpUoRJ/rfN+jLdj/szva+JVl5OXnykL8AKTBFFmrB+Bcoa3yDDHUma0sExkC9RhGqQQ+EkEEwBofVvVEVveYwt12k8ihVjs3Evdl+yGnnpWCnyxsx9/ZyJK6ewUsPlNdzjoPfFXT62YgjlYn1Iy813BDLT5GE0+khW+2XrSnYu81SNwRh0hXsKkJcYxLrZYIuqIa5hdotxPX34PMaFflquIzIZHd3hnd2E6AoNrNFjueRR6dJv/LzLS/qc/d78B3vzOZG6c8iUdve5eWTgoIBOQ0MP3a101pOIHNcThs6nvIGn+KYoNAMEWGYtd/mHW5nDMOTT+paEcuNfV8cXCs8xv1rebhDxzuclg9XPofwOPkecCaejdVidJnu2MY72rpz3Et1Nrxdt2tneEazgs8i3w4aQQ++At/WH1rJ/g/v9nJGIlE7n+yWLRoHny1BWHtmy1/lZuCsG8WeclR3YZnp34OPo/Shpf3tJK7me0z2usJR8aRVZUHXnJasA5RujXYXKV95h+xa/1bcvJkpE8k1SBH4K8lmxoGzjovN5GB5on8kxXo9LJLCSu+MS83zow2ExL3IpMLqUoBZup9O9Eo2HTSzJ4skX8nI1ZPm+XWiDLVmCMbCSw/UKMaU1ZDhgnQ+5akHYHjbo6BG7JVdYPal6VbdWY3UhxeFrJwQVodC7ot6s7/Gmb/R/dpcnPbmynwGPVDWRYAoRaGBKSvqdoUohTGiYPznzx4g6M7e9tZ1Gwg9EOGaMpdcy7yA4cdSPx5hEBRXwvYtCbTOQDUY859uxBgmMe1ovBJYBwm+IS2BjIJxBHOK/h4Q1Sh89/VAXVy7NJNExW8WoKmmqdrxuiPsvV8XHSIGcU67ABOeOGRO9ZWhJkyfzyd6PNHiCfjE97HnNyKdgbvdSNARKkPdZbPLcjkTi36VPlLXlArDdPZeUcx3hjanz/9QpBOF5+9jqpyt8KiJu5lYwq14uA3ttTeT0gfCO2YnoeYpF29hXKJ8F9hktDKzM4chLNrHzm+JQKmgq61oxf37bFHPV9P4uesWohsO0NdmZvi00m/xehQ8EtviVGmTCu6JCm075FOVQNvyqmNlZu6MrixhJNlKm5ftnApV2sreqY7VdW5Ioxnz7blE3Se14E+p/abAy6v0cQjGQBQlSZHFAc+PxvIf9EfT7Q+W5Q+CGOgBArtYkKA8L0AP5K85gizxA1mRRLGzurzO//Fn5e8XDb+KrmvTfUYYvR6I94L/0faNjk6G/EvvS4X3g/MvmlHdkTB9XA/ZCCaN66s+bu9htX0qlKGgbaDa6nwOLTXbNUkNXl5+9kCZQxYV9QWMAb2cYTchpGzyKXsHXxBl8FKCsSArvKQo8nD48hc1Wvj6KwcAAA==',
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
  
