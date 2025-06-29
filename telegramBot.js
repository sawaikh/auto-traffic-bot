// telegramBot.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Telegram Bot Token
const TOKEN = '7873936483:AAFkEOQQt-dQsYYAJo_y4YdVAYTz0ipfsc0';
const bot = new TelegramBot(TOKEN, { polling: true });

// In-memory state (can be saved to file/db)
let taskState = {
  url: null,
  ads: null,
  duration: null,
  scroll: null,
};

let vpsList = ['vps-east1', 'vps-west2', 'vps-central', 'vps-south1'];
let vpsStatus = {}; // will store success/failure & reason

// Command: /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
👋 Welcome to VPS Bot Controller

Commands:
/url <link>         → Start task setup
/status             → Show result summary
/stop               → Stop all bots
/restart all        → Restart offline VPS
/restart <vps-id>   → Restart specific VPS
/grant @username    → Add admin
/revoke @username   → Remove admin
  `);
});

// Command: /url
bot.onText(/\/url (.+)/, (msg, match) => {
  const url = match[1];
  taskState.url = url;
  bot.sendMessage(msg.chat.id, `🔗 URL set to: ${url}\nDo you want to enable ad clicks? (yes/no)`);
});

// Command: /ads yes|no
bot.onText(/\/ads (yes|no)/, (msg, match) => {
  taskState.ads = match[1];
  bot.sendMessage(msg.chat.id, `🕒 Enter session duration (in seconds) using /duration <time>`);
});

// Command: /duration <sec>
bot.onText(/\/duration (\d+)/, (msg, match) => {
  taskState.duration = parseInt(match[1]);
  bot.sendMessage(msg.chat.id, `🔁 Enter scroll count using /scroll <count>`);
});

// Command: /scroll <count>
bot.onText(/\/scroll (\d+)/, (msg, match) => {
  taskState.scroll = parseInt(match[1]);
  bot.sendMessage(msg.chat.id, `✅ Task dispatched to active VPS. Waiting for result...`);

  // Fake result handler for now
  setTimeout(() => {
    bot.sendMessage(msg.chat.id, `
📊 Task Summary:

✅ Successful: 3
❌ Failed: 1

❌ vps-west2 — Ads not found

URL: ${taskState.url}
Duration: ${taskState.duration}s
Ads: ${taskState.ads}
Scroll: ${taskState.scroll}
    `);
  }, taskState.duration * 1000 + 2000);
});
