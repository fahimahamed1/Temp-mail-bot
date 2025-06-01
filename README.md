
# 📧 Telegram Temp Mail Bot

A **Telegram bot** that lets users generate and manage temporary email addresses using the [Mail.tm API](https://docs.mail.tm). Easily create custom or random email addresses, view inbox messages, delete emails, and manage multiple temp emails — all from within Telegram.

---

## 🚀 Features

- 🔄 Generate **random** or **custom** temporary email addresses  
- 🔐 Set your own password when creating custom emails  
- 📥 View inbox messages (sender + subject preview)  
- 📄 Read full message content  
- 🗑️ Delete individual emails  
- 📚 Manage multiple email addresses per user  
- ✏️ Change default email prefix for random generation  
- 🌐 Powered by the official **Mail.tm public API**

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/temp-mail-telegram-bot.git
cd temp-mail-telegram-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file in the root directory and add your **Telegram bot token**:

```env
BOT_TOKEN=your_telegram_bot_token_here
```

---

## ▶️ Run the Bot

```bash
node index.js
```

---

## 💬 How to Use

### 1. Start the Bot

Send `/start` in the Telegram chat to begin.

### 2. View the Menu

Send `/menu` to access all options:

- ✅ Create random email  
- 🧑‍💻 Create custom email  
- 📬 View inbox  
- 🗑️ Delete emails  
- ✏️ Change default prefix

### 3. Custom Email Flow

1. Select **"Create custom email"**  
2. Enter a username (e.g., `john.doe`)  
3. Enter a password (min 6 characters)  
4. You’ll receive an email like: `john.doe@dcpa.net`

### 4. Inbox Handling

- View a list of your emails showing **sender** and **subject**
- Tap on a message to read the **full content**
- Option to delete individual messages

---

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org)
- [Telegraf.js](https://telegraf.js.org/)
- [Mail.tm API](https://docs.mail.tm/)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
