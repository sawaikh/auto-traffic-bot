const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const BOT_TOKEN = '7873936483:AAFkEOQQt-dQsYYAJo_y4YdVAYTz0ipfsc0';
const VPS_ID = `vps-${Math.floor(Math.random() * 10000)}`;
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

let currentTask = null;
let isRunning = false;

async function report(status, reason = '') {
  await bot.sendMessage(5531115917, `📡 ${VPS_ID}\n${status}${reason ? `\n🧾 ${reason}` : ''}`);
}

async function runTask({ url, ads, duration, scroll }) {
  try {
    isRunning = true;
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Spoof traffic source
    await page.setExtraHTTPHeaders({
      referer: Math.random() < 0.5 ? 'https://www.google.com/' : 'https://www.facebook.com/'
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Scroll loop
    for (let i = 0; i < scroll; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise(r => setTimeout(r, 2000));
    }

    // Ad click
    if (ads === 'yes') {
      const links = await page.$$('a');
      if (links.length > 0) {
        await links[0].click();
      }
    }

    await new Promise(r => setTimeout(r, duration * 1000));
    await browser.close();

    await report('✅ Task completed');
  } catch (err) {
    await report('❌ Task failed', err.message);
  } finally {
    isRunning = false;
  }
}

function checkForCommandLoop() {
  setInterval(() => {
    try {
      const raw = fs.readFileSync('./task.json', 'utf8');
      if (!raw) return;
      const task = JSON.parse(raw);

      if (JSON.stringify(task) !== JSON.stringify(currentTask)) {
        currentTask = task;
        runTask(task);
      }
    } catch (e) {
      // file missing or invalid
    }
  }, 10000);
}

checkForCommandLoop();
