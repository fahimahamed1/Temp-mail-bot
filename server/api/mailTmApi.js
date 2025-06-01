// providers/mailTmApi.js
const axios = require('axios');
const BASE_URL = 'https://api.mail.tm';

// Helper to include token in requests
const withAuth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = {
  async getAvailableDomain() {
    const response = await axios.get(`${BASE_URL}/domains`);
    const domains = response.data?.['hydra:member'];

    if (!domains || domains.length === 0) {
      throw new Error('No available domains found.');
    }

    return domains[0].domain;
  },

  async createAccount(email, password) {
    try {
      await axios.post(`${BASE_URL}/accounts`, { address: email, password });
    } catch (err) {
      const status = err.response?.status;

      // Ignore errors for already existing or invalid accounts
      if (![409, 422].includes(status)) {
        throw new Error('Could not create account.');
      }
    }
  },

  async login(email, password) {
    const response = await axios.post(`${BASE_URL}/token`, { address: email, password });
    return response.data.token;
  },

  async fetchInbox(token) {
    const response = await axios.get(`${BASE_URL}/messages`, {
      headers: withAuth(token),
    });

    return response.data?.['hydra:member'] || [];
  },

  async fetchMessage(token, messageId) {
    const response = await axios.get(`${BASE_URL}/messages/${messageId}`, {
      headers: withAuth(token),
    });

    return response.data;
  },

  async removeMessage(token, messageId) {
    await axios.delete(`${BASE_URL}/messages/${messageId}`, {
      headers: withAuth(token),
    });
  },
};
