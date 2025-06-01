const { getInbox, getMessage, deleteMessage } = require('../mailService');

const lastSeenMessageIds = {};

async function showInbox(bot, chatId, usersMails) {
  const accounts = usersMails[chatId];
  if (!accounts || accounts.length === 0) {
    return bot.sendMessage(chatId, "❌ No emails found.");
  }

  const messages = [];

  for (let i = 0; i < accounts.length; i++) {
    try {
      const inbox = await getInbox(accounts[i].token);
      inbox.forEach(msg => messages.push({ ...msg, emailIndex: i }));
    } catch (err) {
      console.error(`Error checking inbox at index ${i}:`, err.message);
    }
  }

  if (messages.length === 0) {
    return bot.sendMessage(chatId, "📭 Inbox is empty.");
  }

  const keyboard = messages.map(msg => [{
    text: `📧 From: ${msg.from.address}`,
    callback_data: `view_${msg.id}_${msg.emailIndex}`
  }]);

  bot.sendMessage(chatId, "📥 Your messages:", {
    reply_markup: { inline_keyboard: keyboard }
  });
}

async function viewMessage(bot, chatId, data, usersMails) {
  const [, id, index] = data.split('_');
  const account = usersMails[chatId]?.[index];
  if (!account) return bot.sendMessage(chatId, "❌ Email not found.");

  const msg = await getMessage(account.token, id);
  const date = new Date(msg.createdAt).toLocaleString();

  const message = `👤 From: ${msg.from.address}
📅 Date: ${date}
✏️ Subject: ${msg.subject || '(No Subject)'}
📝 ${msg.text || '(No Content)'}`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🗑️ Delete Message", callback_data: `delmsg_${id}_${index}` }]
      ]
    }
  };

  bot.sendMessage(chatId, message, options);
}

async function deleteMessageHandler(bot, chatId, data, usersMails, saveUserData) {
  const [, id, index] = data.split('_');
  const account = usersMails[chatId]?.[index];
  if (!account) return bot.sendMessage(chatId, "❌ Email not found.");

  await deleteMessage(account.token, id);
  bot.sendMessage(chatId, "✅ Message deleted.");
}

function startInboxPolling(bot, usersMails) {
  setInterval(async () => {
    for (const chatId in usersMails) {
      const accounts = usersMails[chatId];

      for (const { token, email } of accounts) {
        try {
          const inbox = await getInbox(token);
          for (const msg of inbox) {
            const key = `${email}_${msg.id}`;
            if (!lastSeenMessageIds[key]) {
              lastSeenMessageIds[key] = true;

              const full = await getMessage(token, msg.id);
              const date = new Date(full.createdAt).toLocaleString();

              const text = `📨 *New Email on* \`${email}\`:\n\n` +
                `👤 *From:* ${full.from.address}\n` +
                `📅 *Date:* ${date}\n` +
                `✏️ *Subject:* ${full.subject || '(No Subject)'}\n\n` +
                `📝 ${full.text || '[No content]'}`;

              bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
            }
          }
        } catch (err) {
          console.error(`Polling error for ${email}:`, err.message);
        }
      }
    }
  }, 10000);
}

module.exports = {
  showInbox,
  viewMessage,
  deleteMessage: deleteMessageHandler,
  startInboxPolling
};
