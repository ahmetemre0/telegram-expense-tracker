const User = require("../models/User");

async function updateUserAnalytics(chatId) {
    const user = await User.findOne({ chatId });

    if (!user || user.expenses.length === 0) return;

    // Compute total spent
    const totalSpent = user.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Compute average daily spending
    const daysTracked = new Set(user.expenses.map(exp => exp.date.toISOString().split("T")[0])).size;
    const averageDailySpending = daysTracked > 0 ? totalSpent / daysTracked : 0;

    // Compute most used category
    const categoryCount = {};
    user.expenses.forEach(exp => {
        categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });

    const mostUsedCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, "");

    // Update user's analytics
    user.analytics = { totalSpent, averageDailySpending, mostUsedCategory };
    await user.save();
}

module.exports = { updateUserAnalytics };
