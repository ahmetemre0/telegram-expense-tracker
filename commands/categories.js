const User = require("../models/User");

const messages = {
    viewCategories: {
        en: "📌 **Your Categories:**\n{{categories}}",
        tr: "📌 **Kategorileriniz:**\n{{categories}}"
    },
    categoryAdded: {
        en: "✅ **{{category}}** added successfully.",
        tr: "✅ **{{category}}** başarıyla eklendi."
    },
    categoryRemoved: {
        en: "🗑️ **{{category}}** removed successfully.",
        tr: "🗑️ **{{category}}** başarıyla kaldırıldı."
    },
    categoryUpdated: {
        en: "🔄 **{{oldCategory}}** updated to **{{newCategory}}**.",
        tr: "🔄 **{{oldCategory}}**, **{{newCategory}}** olarak güncellendi."
    },
    categoryExists: {
        en: "⚠️ **{{category}}** already exists.",
        tr: "⚠️ **{{category}}** zaten mevcut."
    },
    categoryNotFound: {
        en: "⚠️ **{{category}}** does not exist.",
        tr: "⚠️ **{{category}}** bulunamadı."
    }
};

module.exports = {

    viewCategories: async (bot, msg) => {
        const chatId = msg.chat.id;
        let user = await User.findOne({ chatId });

        if (!user) {
            user = new User({ chatId });
            await user.save();
        }

        const categories = user.categories.join(", ");
        bot.sendMessage(chatId, messages.viewCategories[user.language].replace("{{categories}}", categories));
    },

    addCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const newCategory = match[1].trim();
    
        let user = await User.findOne({ chatId });
    
        if (!user) {
            user = new User({ chatId });
        }
    
        if (user.categories.includes(newCategory)) {
            bot.sendMessage(chatId, messages.categoryExists[user.language].replace("{{category}}", newCategory));
            return;
        }
    
        user.categories.push(newCategory);
        await user.save();
    
        bot.sendMessage(chatId, messages.categoryAdded[user.language].replace("{{category}}", newCategory));
    },

    removeCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const categoryToRemove = match[1].trim();
    
        let user = await User.findOne({ chatId });
    
        if (!user || !user.categories.includes(categoryToRemove)) {
            bot.sendMessage(chatId, messages.categoryNotFound[user.language].replace("{{category}}", categoryToRemove));
            return;
        }
    
        user.categories = user.categories.filter(cat => cat !== categoryToRemove);
        await user.save();
    
        bot.sendMessage(chatId, messages.categoryRemoved[user.language].replace("{{category}}", categoryToRemove));
    },

    updateCategory: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const [oldCategory, newCategory] = match[1].split(" ").map(cat => cat.trim());
    
        let user = await User.findOne({ chatId });
    
        if (!user || !user.categories.includes(oldCategory)) {
            bot.sendMessage(chatId, messages.categoryNotFound[user.language].replace("{{category}}", oldCategory));
            return;
        }
    
        if (user.categories.includes(newCategory)) {
            bot.sendMessage(chatId, messages.categoryExists[user.language].replace("{{category}}", newCategory));
            return;
        }
    
        user.categories = user.categories.map(cat => (cat === oldCategory ? newCategory : cat));
        await user.save();
    
        bot.sendMessage(chatId, messages.categoryUpdated[user.language]
            .replace("{{oldCategory}}", oldCategory)
            .replace("{{newCategory}}", newCategory));
    },

};
