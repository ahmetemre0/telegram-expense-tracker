const User = require("../models/User");

const messages = {
    noBudget: {
        en: "❌ No budget data found. Use /setbudget first.",
        tr: "❌ Bütçe verisi bulunamadı. Önce /setbudget komutunu kullanın."
    },
    budgetSet: {
        en: "💰 Your budget is set to {{budget}} {{currency}}",
        tr: "💰 Bütçeniz {{budget}} {{currency}} olarak ayarlandı"
    },
    budgetSummary: {
        en: "💰 **Budget Summary** 💰\n" +
            "Total Budget: {{budget}}\n" +
            "Total Spent: {{totalSpent}}\n" +
            "Remaining: {{remaining}}\n" +
            "Avg. Daily Spending: {{averageDailySpending}}\n" +
            "Most Used Category: {{mostUsedCategory}}",
        tr: "💰 **Bütçe Özeti** 💰\n" +
            "Toplam Bütçe: {{budget}}\n" +
            "Toplam Harcanan: {{totalSpent}}\n" +
            "Kalan: {{remaining}}\n" +
            "Ort. Günlük Harcama: {{averageDailySpending}}\n" +
            "En Çok Kullanılan Kategori: {{mostUsedCategory}}"
    },
    noUser: {
        en: "❌ No user found. Please use /start first.",
        tr: "❌ Kullanıcı bulunamadı. Lütfen önce /start komutunu kullanın."
    }
};

module.exports = {
    setBudget: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const budget = parseFloat(match[1]);

        const user = await User.findOne({ chatId });
        if (!user) {
            bot.sendMessage(chatId, messages.noUser[user.language]);
            return;
        }

        await User.findOneAndUpdate({ chatId }, { budget }, { upsert: true });
        bot.sendMessage(chatId, messages.budgetSet[user.language]
            .replace("{{budget}}", budget)
            .replace("{{currency}}", user.currency));
    },

    showBudget: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user) {
            bot.sendMessage(chatId, messages.noUser[user.language]);
            return;
        }

        if (user.budget === 0) {
            bot.sendMessage(chatId, messages.noBudget[user.language]);
            return;
        }

        let response = `💰 **Budget Summary** 💰\n`;
        response += `Total Budget: $${user.budget}\n`;
        response += `Total Spent: $${user.analytics.totalSpent}\n`;
        response += `Remaining: $${user.budget - user.analytics.totalSpent}\n`;
        response += `Avg. Daily Spending: $${user.analytics.averageDailySpending.toFixed(2)}\n`;
        response += `Most Used Category: ${user.analytics.mostUsedCategory || "None"}\n`;

        bot.sendMessage(chatId, messages.budgetSummary[user.language]
            .replace("{{budget}}", user.budget)
            .replace("{{totalSpent}}", user.analytics.totalSpent)
            .replace("{{remaining}}", user.budget - user.analytics.totalSpent)
            .replace("{{averageDailySpending}}", user.analytics.averageDailySpending.toFixed(2))
            .replace("{{mostUsedCategory}}", user.analytics.mostUsedCategory || "❓"));
    }
};
