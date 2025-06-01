// generateEmail.js
const { getDomain, createUser } = require('../mailService');
const generateUsername = require('../utils/usernameGenerator');

const DEFAULT_PASSWORD = 'secure-temp-bot-password';

async function generateUniqueEmail(usersMails, chatId, maxTries = 5) {
  for (let i = 0; i < maxTries; i++) {
    const username = generateUsername();
    const domain = await getDomain();
    const email = `${username}@${domain}`;

    // Prevent duplicates in current session
    const exists = usersMails[chatId]?.some(entry => entry.email === email);
    if (!exists) return { email, username, domain };
  }

  throw new Error('Could not create a unique email.');
}

module.exports = async function handleGenerateEmail(bot, chatId, usersMails, saveUserData) {
  try {
    const { email } = await generateUniqueEmail(usersMails, chatId);
    const user = await createUser(email, DEFAULT_PASSWORD);

    // Save user mail data
    if (!usersMails[chatId]) usersMails[chatId] = [];
    usersMails[chatId].push(user);
    await saveUserData(usersMails);

    await bot.sendMessage(chatId, `✅ Your temp mail: ${email}`);
  } catch (err) {
    console.error('Email generation error:', err.message);
    await bot.sendMessage(chatId, '❌ Could not generate email. Please try again later.');
  }
};
