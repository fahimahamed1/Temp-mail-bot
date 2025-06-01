// mailService.js
const mailApi = require('./api/mailTmApi');

// Get an available domain from the provider
async function getDomain() {
  return await mailApi.getAvailableDomain();
}

// Register a new user and log in immediately
async function createUser(email, password) {
  await mailApi.createAccount(email, password);
  const token = await mailApi.login(email, password);

  return { email, password, token };
}

// Retrieve the inbox (list of messages)
async function getInbox(token) {
  return await mailApi.fetchInbox(token);
}

// Get the full content of a specific message
async function getMessage(token, messageId) {
  return await mailApi.fetchMessage(token, messageId);
}

// Delete a specific message from the inbox
async function deleteMessage(token, messageId) {
  return await mailApi.removeMessage(token, messageId);
}

module.exports = {
  getDomain,
  createUser,
  getInbox,
  getMessage,
  deleteMessage,
};
