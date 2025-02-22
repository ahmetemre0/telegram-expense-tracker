const User = require("../models/User");

const messages = {
    newUser: {
        "en": "Welcome! Let's manage your budget. Use /help to see all commands.",
        "tr": "Hoş geldiniz! Bütçenizi yönetmeye başlayalım. Tüm komutları görmek için /help kullanın."
    },
    existingUser: {
        "en": "Welcome back! Use /help to see all commands.",
        "tr": "Tekrar hoş geldiniz! Tüm komutları görmek için /help kullanın."
    }
};

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;

    let user = await User.findOne({ chatId });

    if (!user) {
        user = new User({ chatId });
        await user.save();
        bot.sendMessage(chatId, messages.newUser[user.language]);
    }
    else {
        bot.sendMessage(chatId, messages.existingUser[user.language]);
    }
};
