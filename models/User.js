const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    chatId: { type: Number, required: true, unique: true },
    budget: { type: Number, default: 0 },
    expenses: [
        {
            category: String,
            amount: Number,
            date: { type: Date, default: Date.now },
            location: String,  // Optional: Store location if needed
            note: String  // User can add custom notes for AI sentiment analysis
        }
    ],
    categories: { 
        type: [String], 
        default: ["Food", "Transport", "Entertainment", "Shopping"]
    },
    analytics: {
        totalSpent: { type: Number, default: 0 }, // For quick access
        averageDailySpending: { type: Number, default: 0 },
        mostUsedCategory: { type: String, default: "" }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
