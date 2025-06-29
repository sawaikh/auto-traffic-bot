#!/bin/bash

sudo apt update -y && sudo apt upgrade -y
sudo apt install -y curl wget git nodejs npm

# Clone GitHub repo
git clone https://github.com/sawaikh/vps-bot.git
cd vps-bot

# Install Node packages
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth node-telegram-bot-api

# Start bot
node vpsClient.js
