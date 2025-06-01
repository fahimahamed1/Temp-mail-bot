const fs = require('fs');
const path = require('path');

// usersMails.json in the same directory as this file
const filePath = path.join(__dirname, 'usersMails.json');

function loadUserData() {
  try {
    if (!fs.existsSync(filePath)) return {};
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load user data:', err);
    return {};
  }
}

function saveUserData(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save user data:', err);
    throw err;
  }
}

module.exports = { loadUserData, saveUserData };