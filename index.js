require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your bot's token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// In-memory storage for user data (replace with a database in a real application)
const users = new Map();

// Airdrop configuration
const airdropAmount = 100; // Amount of tokens to distribute per user
const totalAirdropSupply = 10000; // Total number of tokens available for airdrop
let remainingAirdropSupply = totalAirdropSupply;

// Admin user ID (replace with your Telegram user ID)
const adminUserId = 5936308193;

// Command handler for /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Airdrop Bot! Use /register to participate in the airdrop.');
});

// Command handler for /register
bot.onText(/\/register/, (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (users.has(userId)) {
    bot.sendMessage(chatId, 'You are already registered for the airdrop.');
  } else if (remainingAirdropSupply >= airdropAmount) {
    users.set(userId, { balance: airdropAmount });
    remainingAirdropSupply -= airdropAmount;
    bot.sendMessage(chatId, `Congratulations! You have received ${airdropAmount} tokens in the airdrop.`);
  } else {
    bot.sendMessage(chatId, 'Sorry, the airdrop supply has been exhausted.');
  }
});

// Command handler for /balance
bot.onText(/\/balance/, (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (users.has(userId)) {
    const balance = users.get(userId).balance;
    bot.sendMessage(chatId, `Your current balance is ${balance} tokens.`);
  } else {
    bot.sendMessage(chatId, 'You are not registered for the airdrop. Use /register to participate.');
  }
});

// Command handler for /airdrop_info (admin only)
bot.onText(/\/airdrop_info/, (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (userId === adminUserId) {
    const participantCount = users.size;
    bot.sendMessage(chatId, `Airdrop Info:
Participants: ${participantCount}
Remaining Supply: ${remainingAirdropSupply} tokens`);
  } else {
    bot.sendMessage(chatId, 'This command is only available to administrators.');
  }
});

console.log('Airdrop bot is running...');
