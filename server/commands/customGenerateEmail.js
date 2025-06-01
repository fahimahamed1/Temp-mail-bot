// generateCustomEmail.js
const { getDomain, createUser } = require('../mailService');

const isValidUsername = (username) =>
  /^[a-zA-Z0-9._-]{3,30}$/.test(username); // Enforce reasonable limits

const DEFAULT_PASSWORD = 'secure-temp-bot-password';

module.exports = async function handleCustomEmail(bot, chatId, usersMails, saveUserData) {
  await bot.sendMessage(chatId, '✍️ Please enter a custom username:');

  const listener = async (msg) => {
    if (msg.chat.id !== chatId) return;

    const username = msg.text.trim();

    // Validate format
    if (!isValidUsername(username)) {
      await bot.sendMessage(
        chatId,
        '❌ Invalid username. Use only letters, numbers, dots (.), underscores (_) or hyphens (-). Length: 3–30 chars.'
      );
      return;
    }

    bot.removeListener('message', listener); // Stop listening after valid input

    try {
      const domain = await getDomain();
      const email = `${username}@${domain}`;
      const user = await createUser(email, DEFAULT_PASSWORD);

      if (!usersMails[chatId]) usersMails[chatId] = [];
      usersMails[chatId].push(user);
      await saveUserData(usersMails);

      await bot.sendMessage(chatId, `✅ Your custom temp mail: ${email}`);
    } catch (err) {
      console.error('Custom email error:', err.response?.data || err.message);
      await bot.sendMessage(chatId, '❌ Could not create this email. Try a different username.');
    }
  };

  bot.on('message', listener);
};
