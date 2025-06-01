module.exports = function showMenu(bot, chatId, messageId = null) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚙️ Generate", callback_data: "generate" },
          { text: "🧾 Custom", callback_data: "custom_generate" }
        ],
        [
          { text: "📂 My Emails", callback_data: "show_emails" },
          { text: "📬 Inbox", callback_data: "inbox" }
        ],
        [
          { text: "🗑️ Delete Email", callback_data: "delete_menu" }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };

  const menuText = `📋 *Email Bot Menu*\n\nSelect an option below to get started:`;

  if (messageId) {
    return bot.editMessageText(menuText, {
      chat_id: chatId,
      message_id: messageId,
      ...opts
    }).catch(() => {
      return bot.sendMessage(chatId, menuText, opts);
    });
  } else {
    return bot.sendMessage(chatId, menuText, opts);
  }
};