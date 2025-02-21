const User = require("../models/User");

module.exports = {

    viewCategories: async (bot, msg) => {
        const chatId = msg.chat.id;
        let user = await User.findOne({ chatId });

        if (!user) {
            user = new User({ chatId });
            await user.save();
        }

        const categories = user.categories.join(", ");
        bot.sendMessage(chatId, `📌 **Your Categories:**\n${categories}`);
    },

    addCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const newCategory = match[1].trim();
    
        let user = await User.findOne({ chatId });
    
        if (!user) {
            user = new User({ chatId });
        }
    
        if (user.categories.includes(newCategory)) {
            bot.sendMessage(chatId, `⚠️ Category **${newCategory}** already exists.`);
            return;
        }
    
        user.categories.push(newCategory);
        await user.save();
    
        bot.sendMessage(chatId, `✅ Category **${newCategory}** added successfully.`);
    },

    removeCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const categoryToRemove = match[1].trim();
    
        let user = await User.findOne({ chatId });
    
        if (!user || !user.categories.includes(categoryToRemove)) {
            bot.sendMessage(chatId, `⚠️ Category **${categoryToRemove}** does not exist.`);
            return;
        }
    
        user.categories = user.categories.filter(cat => cat !== categoryToRemove);
        await user.save();
    
        bot.sendMessage(chatId, `🗑️ Category **${categoryToRemove}** removed successfully.`);
    },

    updateCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const [oldCategory, newCategory] = match[1].split(" ").map(cat => cat.trim());
    
        let user = await User.findOne({ chatId });
    
        if (!user || !user.categories.includes(oldCategory)) {
            bot.sendMessage(chatId, `⚠️ Category **${oldCategory}** does not exist.`);
            return;
        }
    
        if (user.categories.includes(newCategory)) {
            bot.sendMessage(chatId, `⚠️ Category **${newCategory}** already exists.`);
            return;
        }
    
        user.categories = user.categories.map(cat => (cat === oldCategory ? newCategory : cat));
        await user.save();
    
        bot.sendMessage(chatId, `🔄 Category **${oldCategory}** updated to **${newCategory}**.`);
    },

};
