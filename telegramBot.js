const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7873936483:AAFkEOQQt-dQsYYAJo_y4YdVAYTz0ipfsc0';
const bot = new TelegramBot(TOKEN, { polling: true });

let task = { url: null, ads: null, duration: null, scroll: null };

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
🧠 VPS Bot Controller

Commands:
/url <link>
/ads yes|no
/duration <seconds>
/scroll <count>
/status
/stop
/restart all
/restart <vps-id>
`);
});

bot.onText(/\/url (.+)/, (msg, match) => {
  task.url = match[1];
  bot.sendMessage(msg.chat.id, `URL set to: ${task.url}\nReply with: /ads yes OR /ads no`);
});

bot.onText(/\/ads (yes|no)/, (msg, match) => {
  task.ads = match[1];
  bot.sendMessage(msg.chat.id, `Set duration in seconds using /duration <value>`);
});

bot.onText(/\/duration (\d+)/, (msg, match) => {
  task.duration = parseInt(match[1]);
  bot.sendMessage(msg.chat.id, `Set scroll count using /scroll <value>`);
});

bot.onText(/\/scroll (\d+)/, (msg, match) => {
  task.scroll = parseInt(match[1]);
  bot.sendMessage(msg.chat.id, `✅ Task is ready. VPS bots will run this:
🌐 URL: ${task.url}
🖱️ Ads: ${task.ads}
🕒 Duration: ${task.duration}
🔁 Scrolls: ${task.scroll}
`);
});
