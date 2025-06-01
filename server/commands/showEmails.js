module.exports = function(bot, chatId, usersMails) {
  const emails = usersMails[chatId];
  if (!emails || emails.length === 0) {
    return bot.sendMessage(chatId, "📭 No generated emails.");
  }

  const text = emails.map((m, i) => `${i + 1}. ${m.email}`).join("\n");
  bot.sendMessage(chatId, `📧 Your emails:\n${text}`);
};