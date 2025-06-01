// utils/usernameGenerator.js

function generateUsername() {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  let name = '';

  for (let i = 0; i < 6 + Math.floor(Math.random() * 3); i++) {
    const chars = i % 2 === 0 ? consonants : vowels;
    name += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${name}${Math.floor(10 + Math.random() * 90)}`;
}

module.exports = generateUsername;
