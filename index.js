require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const { saveUserData, loadUserData } = require('./server/storage/saveUserData');
const showMenu = require('./server/commands/menu');
const generateEmail = require('./server/commands/generateEmail');
const customGenerate = require('./server/commands/customGenerateEmail');
const showEmails = require('./server/commands/showEmails');
const deleteEmails = require('./server/commands/deleteEmails');
const handleInbox = require('./server/commands/inboxHandler');

// Load user data
const usersMails = loadUserData();

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('📬 Temporary Email Bot is running.');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});

// Start Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("🤖 Telegram bot is running...");

// Start inbox polling
handleInbox.startInboxPolling(bot, usersMails);

// Telegram command handlers...
bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'there';
  const welcome = `
👋 Hello ${name}!

Welcome to the Temporary Email Bot 📬

You can:
✅ Generate temporary email addresses (random or custom)
📥 Check your inbox for messages
🗑️ View or delete emails

Start now by tapping /menu 👇
`;

  bot.sendMessage(msg.chat.id, welcome, {
    reply_markup: {
      keyboard: [['/menu']],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.onText(/\/menu/, (msg) => showMenu(bot, msg.chat.id));

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  const safeReply = async (text) =>
    bot.answerCallbackQuery(query.id, { text, show_alert: true });

  try {
    switch (true) {
      case data === 'generate':
        await generateEmail(bot, chatId, usersMails, saveUserData);
        break;
      case data === 'custom_generate':
        await customGenerate(bot, chatId, usersMails, saveUserData);
        break;
      case data === 'show_emails':
        await showEmails(bot, chatId, usersMails);
        break;
      case data === 'delete_menu':
        await deleteEmails.showDeleteMenu(bot, chatId, usersMails, messageId);
        break;
      case data.startsWith('delete_account_'): {
        const index = parseInt(data.split('_')[2]);
        await deleteEmails.deleteByIndex(bot, chatId, usersMails, index, saveUserData, query);
        break;
      }
      case data === 'delete_all_accounts':
        await deleteEmails.deleteAll(bot, chatId, usersMails, saveUserData, query);
        break;
      case data === 'back_to_menu':
        await showMenu(bot, chatId, messageId);
        break;
      case data === 'inbox':
        await handleInbox.showInbox(bot, chatId, usersMails);
        break;
      case data.startsWith('view_'):
        await handleInbox.viewMessage(bot, chatId, data, usersMails);
        break;
      case data.startsWith('delmsg_'):
        await handleInbox.deleteMessage(bot, chatId, data, usersMails, saveUserData);
        break;
      default:
        return safeReply('❓ Unknown action');
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Callback error:', error);
    await safeReply('⚠️ An error occurred. Please try again.');
  }
});
