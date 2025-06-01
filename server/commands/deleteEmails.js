module.exports = {
  async showDeleteMenu(bot, chatId, usersMails, messageId = null) {
    const mails = usersMails[chatId];
    if (!mails || mails.length === 0) {
      const noMailText = "❌ No emails to delete.";
      if (messageId) {
        return bot.editMessageText(noMailText, { chat_id: chatId, message_id: messageId }).catch(() => {
          return bot.sendMessage(chatId, noMailText);
        });
      } else {
        return bot.sendMessage(chatId, noMailText);
      }
    }

    // Build buttons for each email
    const buttons = mails.map((m, i) => [{
      text: m.email,
      callback_data: `delete_account_${i}`
    }]);

    // Add Delete All & Back buttons at the bottom
    buttons.push([
      { text: "🗑️ Delete All", callback_data: "delete_all_accounts" }
    ]);
    buttons.push([
      { text: "⬅️ Back to Menu", callback_data: "back_to_menu" }
    ]);

    const opts = {
      reply_markup: { inline_keyboard: buttons }
    };

    if (messageId) {
      return bot.editMessageText("🗑 Select an email to delete:", {
        chat_id: chatId,
        message_id: messageId,
        ...opts
      }).catch(() => {
        return bot.sendMessage(chatId, "🗑 Select an email to delete:", opts);
      });
    } else {
      return bot.sendMessage(chatId, "🗑 Select an email to delete:", opts);
    }
  },

  async deleteByIndex(bot, chatId, usersMails, index, saveUserData, query) {
    const emails = usersMails[chatId];
    if (!emails || !emails[index]) {
      if (query) await bot.answerCallbackQuery(query.id, { text: "❌ Invalid selection.", show_alert: true });
      return;
    }

    const removed = emails.splice(index, 1);
    saveUserData(usersMails);

    if (query) {
      await bot.answerCallbackQuery(query.id, { text: `✅ Deleted email: ${removed[0].email}` });

      if (emails.length === 0) {
        // Show no emails left with Back to Menu button
        const opts = {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back to Menu", callback_data: "back_to_menu" }]
            ]
          }
        };
        await bot.editMessageText("❌ No emails to delete.", opts).catch(() => {});
      } else {
        // Refresh delete menu
        await module.exports.showDeleteMenu(bot, chatId, usersMails, query.message.message_id);
      }
    } else {
      bot.sendMessage(chatId, `✅ Deleted email: ${removed[0].email}`);
    }
  },

  async deleteAll(bot, chatId, usersMails, saveUserData, query) {
    const emails = usersMails[chatId];
    if (!emails || emails.length === 0) {
      if (query) {
        return bot.answerCallbackQuery(query.id, {
          text: "❌ No emails to delete.",
          show_alert: true
        });
      }
      return;
    }

    usersMails[chatId] = [];
    saveUserData(usersMails);

    if (query) {
      await bot.answerCallbackQuery(query.id, { text: "✅ All emails deleted." });

      const opts = {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back to Menu", callback_data: "back_to_menu" }]
          ]
        }
      };

      return bot.editMessageText("❌ All emails deleted. No accounts left.", opts).catch(() => {});
    }

    return bot.sendMessage(chatId, "✅ All emails deleted.");
  }
};
