const User = require("../models/User");
const { generateChart } = require("../helpers/chartHelper");
const { updateUserAnalytics } = require("../helpers/analyticsHelper");
const fs = require("fs");

module.exports = {
    addExpense: async (bot, msg, match) => {
        const chatId = msg.chat.id;
    const amount = parseFloat(match[1]);
    const category = match[2].trim();

    let user = await User.findOne({ chatId });

    if (!user) {
        bot.sendMessage(chatId, "⚠️ You need to set a budget first using /setbudget.");
        return;
    }

    // Add expense
    user.expenses.push({ category, amount });
    await user.save();

    // Update analytics
    await updateUserAnalytics(chatId);

    bot.sendMessage(chatId, `✅ Expense of $${amount} added in category: ${category}`);
    },

    listExpenses: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, "No expenses recorded.");
            return;
        }

        let response = "📊 **Your Expenses:**\n";
        user.expenses.forEach(exp => {
            response += `📌 ${exp.category}: $${exp.amount} on ${exp.date.toDateString()}\n`;
        });

        bot.sendMessage(chatId, response);
    },

    // Show Spending by Category
    spendingByCategory: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, "❌ No expenses recorded.");
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
        bot.sendPhoto(chatId, filePath, { caption: "📊 Expense Breakdown by Category" });

        // Cleanup
        setTimeout(() => fs.unlinkSync(filePath), 10000);
    },

    // Show Spending Over Time
    spendingOverTime: async (bot, msg) => {
        const chatId = msg.chat.id;
        const user = await User.findOne({ chatId });

        if (!user || user.expenses.length === 0) {
            bot.sendMessage(chatId, "❌ No expenses recorded.");
            return;
        }

        const moment = require("moment");

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
        bot.sendPhoto(chatId, filePath, { caption: "📈 Your Spending Over Time" });

        // Cleanup
        setTimeout(() => fs.unlinkSync(filePath), 10000);
    }
};
