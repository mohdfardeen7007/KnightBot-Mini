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
    sessionID: process.env.SESSION_ID || 'KnightBot!H4sIAAAAAAAAA5VU25KiSBD9lY161RgLEBAjOmIBQRAV2va+MQ8lFFDItQpUnPDfJ+jL9jzszva+JUnWyZMnT9UPkBeEYQe3YPwDlJRcUI27sG5LDMZAa8IQU9AHAaoRGIPMgEtDhosLVHaLpWcZzXl50qKUmxOjWsQe4esFbI58Bs9P4NEHZXNKif8bwPY6uyAvwqdydZhFhBnFQAqNVVCYEt2autAkiiz19pPDdvQEHh0iIpTkkVHGOMMUpQ5uPUTo1+irbpnfGeNnVuUXmuCuPYOzzeMh81Iz9Ee9HfTsNlCcgRV9jf5WlKhaQam42zRcl95iL1pBe85Xt5wprmurhzKeRWfrKjy/0WckynFgBzivSd1+WXfbiiQ7c3h4cPdbzatNSZQrMoALpWT6YMeKnuiG88EN79jXiD8LFjwZk+Mk52vRLI5hMjvz0XK6EINkWc6PMHNLeMsiLh79StyjH145/x/doVPZHqce1Zkh7w3R8bRGikp1Y0hTM9CgIayHzBtNLJzBr9H3dnxB7u1wL6/bGVy2Qzexjo7fuymbiagKxWhXh+0qFpe34pM+qhv6O5aKu10NwlnuzGpD07ZzxWF3zaiEe2yW28gc6dFzre57O3Ga7U+DaQKXZn4cKomX2ib3PNJuSFIXvZ7YyNJCi5NtRksxjp5eJzrj1g7AmHv0AcURYTVFNSnyLscPhT5AweUF+xTXr/KC+1RfDFo8DZf++aXcLAmxK+xYx7NsTJpLeNk268p3RLiu4BPog5IWPmYMBxZhdUHbBWYMRZiB8V/f+yDHt/ptcV07geuDkFBWb/KmTAsUfGz14yfy/aLJ65c29/UuwBSM4Wca1zXJI9bp2OSI+jG5YD1GNQPjEKUM/z0hpjh4z/UBLZrumJ2HxW82oKvMVqPI7BR779dVB7hGJGVdgT099LA9MWY9PmGj6VQ1IlWPVPDJ72PRb0KuhY3nimjNVZa2OpvZfG7yxaBK7snGFgvLXr9si2K6svQpe/oHEDAG4o5X545KPbOsX1L/tEBKtd7HrtTzxNA4r8qgqVqXOWZwJHybbOdhkPF2C3PJClBydg2kRdTkR1YlDIYCCtLTaaten7puAb4QH//abHi5IfdlXS6byz2hOwZNUXQTf29MS2Vb2ii43HL3JYnUu3xRqHF3uNiUdYHXs8X1MKO5T/ggvonXjXfMJVHQZ3t0IM9vFsxevU8CMAY8L4ojmRcgVMbcn+zbtdsfKstvOa5BH+SoqwUTUuTtH3qRZjhHFN9BH6SvxzlZhII8Enm+izqILv9xy9L31428+q/r2H2GBL8+Fu/Y/8HgTZnOkfDR/wXh/fH5F/toG4Wb3JvdWUHxdXPUjqS9BZUnFaMhp7tIaw2YIkc7r64xBY/H9z4oU1SHBc3AGLDshLoJEavVzxuwJhlmNcpKMOZkWRL5IZTh4ydwJsV1NwcAAA==',
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
  
