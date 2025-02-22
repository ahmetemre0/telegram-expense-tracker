const User = require("../models/User");
const { generateChart } = require("../helpers/chartHelper");
const { updateUserAnalytics } = require("../helpers/analyticsHelper");
const fs = require("fs");
const moment = require("moment");

const messages = {
    noBudget: {
        en: "⚠️ You need to set a budget first using /setbudget.",
        tr: "⚠️ Önce /setbudget komutu ile bir bütçe belirlemelisiniz."
    },
    noExpensesRecorded: {
        en: "❌ No expenses recorded.",
        tr: "❌ Kaydedilmiş harcama bulunamadı."
    },
    expenseAdded: {
        en: "✅ Expense of {{amount}} {{currency}} added in category: {{category}}",
        tr: "✅ {{amount}} {{currency}} harcama, {{category}} kategorisine eklendi."
    },
    expenseList: {
        en: "📊 **Your Expenses:**\n",
        tr: "📊 **Harcamalarınız:**\n"
    },
    spendingByCategory: {
        en: "📊 Expense Breakdown by Category",
        tr: "📊 Kategoriye Göre Harcama Dağılımı"
    },
    spendingOverTime: {
        en: "📈 Your Spending Over Time",
        tr: "📈 Zaman İçindeki Harcamalarınız"
    },
    expense: {
        en: "📌{{category}}: {{amount}} {{currency}} on {{date}}\n",
        tr: "📌{{category}}: {{amount}} {{currency}} - {{date}} \n"
    }
};

module.exports = {
    addExpense: async (bot, msg, match) => {
        const chatId = msg.chat.id;
    const amount = parseFloat(match[1]);
    const category = match[2].trim();

    let user = await User.findOne({ chatId });

    if (!user) {
        bot.sendMessage(chatId, messages.noBudget[user.language]);
        return;
    }

    // Add expense
    user.expenses.push({ category, amount });
    await user.save();

    // Update analytics
    await updateUserAnalytics(chatId);

    bot.sendMessage(chatId, messages.expenseAdded[user.language]
        .replace("{{amount}}", amount)
        .replace("{{category}}", category)
        .replace("{{currency}}", user.currency));
    },

    listExpenses: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, messages.noExpensesRecorded[user.language]);
            return;
        }

        let response = messages.expenseList[user.language];
        user.expenses.forEach(exp => {
            response += messages.expense[user.language]
                .replace("{{category}}", exp.category)
                .replace("{{amount}}", exp.amount)
                .replace("{{currency}}", user.currency)
                .replace("{{date}}", moment(exp.date).format("YYYY-MM-DD"));
        });

        bot.sendMessage(chatId, response);
    },

    // Show Spending by Category
    spendingByCategory: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, messages.noExpensesRecorded[user.language]);
            return;
        }

        // Aggregate expenses by category
        const categoryMap = {};
        user.expenses.forEach(exp => {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
        });

        const labels = Object.keys(categoryMap);
        const values = Object.values(categoryMap);

        // Generate a Pie Chart
        const filePath = await generateChart(labels, values, "pie", "Expense Breakdown");

        // Send the chart to the user
        bot.sendPhoto(chatId, filePath, { caption: messages.spendingByCategory[user.language] });

        // Cleanup
        setTimeout(() => fs.unlinkSync(filePath), 10000);
    },

    // Show Spending Over Time
    spendingOverTime: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, messages.noExpensesRecorded[user.language]);
            return;
        }

        // Group expenses by date
        const dateMap = {};
        user.expenses.forEach(exp => {
            const date = moment(exp.date).format("YYYY-MM-DD");
            dateMap[date] = (dateMap[date] || 0) + exp.amount;
        });

        const labels = Object.keys(dateMap);
        const values = Object.values(dateMap);

        // Generate a Line Chart
        const filePath = await generateChart(labels, values, "line", "Spending Over Time");

        // Send the chart to the user
        bot.sendPhoto(chatId, filePath, { caption: messages.spendingOverTime[user.language] });

        // Cleanup
        setTimeout(() => fs.unlinkSync(filePath), 10000);
    }
};
