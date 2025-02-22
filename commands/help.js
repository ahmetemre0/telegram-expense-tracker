const commandDocs = `
📌 **Available Commands:**
✅ /start - Initialize the bot and see this help menu.
✅ /setbudget <amount> - Set your total budget.
✅ /budget - View your budget summary and analytics.
✅ /addcategory <category> - Add a new expense category.
✅ /removecategory <category> - Remove an expense category.
✅ /updatecategory <old> <new> - Rename a category.
✅ /categories - View your expense categories.
✅ /expense <amount> <category> - Log an expense.
✅ /expenses - View all logged expenses.
✅ /spendingbycategory - View a pie chart of expenses by category.
✅ /spendingovertime - View a line chart of expenses over time.
✅ /managecategories - Manage your categories with interactive buttons.
✅ /help - Show this command list.
✅ /changelanguage - Change your language preference.
✅ /changecurrency - Change your currency preference.
✅ /deleteaccount - Delete your account and all data.
📌 **Note:** All commands are case-insensitive.
`;


module.exports = (bot, msg) => {
    bot.sendMessage(msg.chat.id, commandDocs);
}