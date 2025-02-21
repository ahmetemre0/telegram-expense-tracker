const User = require("../models/User");

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;

    let user = await User.findOne({ chatId });

    if (!user) {
        user = new User({ chatId });
        await user.save();
        bot.sendMessage(chatId, "Welcome! Let's manage your budget.");
    } else {
        bot.sendMessage(chatId, "Welcome back! Use /budget to check your budget.");
    }
};
