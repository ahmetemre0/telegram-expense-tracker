require("dotenv").config();
const connectDB = require("./config/db");
const bot = require("./bot/bot");

const startCommand = require("./commands/start");
const budgetCommands = require("./commands/budget");
const expenseCommands = require("./commands/expenses");
const categoryCommands = require("./commands/categories");


// Connect to MongoDB
connectDB();

// Handle /start command
bot.onText(/\/start/, (msg) => startCommand(bot, msg));

// Budget commands
bot.onText(/\/setbudget (\d+)/, (msg, match) => budgetCommands.setBudget(bot, msg, match));
bot.onText(/\/budget/, (msg) => budgetCommands.showBudget(bot, msg));

// Expense commands
bot.onText(/\/expense (\d+) (.+)/, (msg, match) => expenseCommands.addExpense(bot, msg, match));
bot.onText(/\/expenses/, (msg) => expenseCommands.listExpenses(bot, msg));

bot.onText(/\/categories/, (msg) => categoryCommands.viewCategories(bot, msg));
bot.onText(/\/addcategory (.+)/, (msg, match) => categoryCommands.addCategory(bot, msg, match));
bot.onText(/\/removecategory (.+)/, (msg, match) => categoryCommands.removeCategory(bot, msg, match));
bot.onText(/\/updatecategory (.+)/, (msg, match) => categoryCommands.updateCategory(bot, msg, match));

bot.onText(/\/spendingbycategory/, (msg) => expenseCommands.spendingByCategory(bot, msg));
bot.onText(/\/spendingovertime/, (msg) => expenseCommands.spendingOverTime(bot, msg));




console.log("✅ Bot is running...");
