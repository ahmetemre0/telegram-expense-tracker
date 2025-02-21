const User = require("../models/User");

module.exports = {
    setBudget: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const budget = parseFloat(match[1]);

        await User.findOneAndUpdate({ chatId }, { budget }, { upsert: true });
        bot.sendMessage(chatId, `Your budget is set to $${budget}`);
    },

    showBudget: async (bot, msg) => {
        const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (!user) {
        bot.sendMessage(chatId, "❌ No budget data found. Use /setbudget first.");
        return;
    }

    let response = `💰 **Budget Summary** 💰\n`;
    response += `Total Budget: $${user.budget}\n`;
    response += `Total Spent: $${user.analytics.totalSpent}\n`;
    response += `Remaining: $${user.budget - user.analytics.totalSpent}\n`;
    response += `Avg. Daily Spending: $${user.analytics.averageDailySpending.toFixed(2)}\n`;
    response += `Most Used Category: ${user.analytics.mostUsedCategory || "None"}\n`;

    bot.sendMessage(chatId, response);
    }
};
