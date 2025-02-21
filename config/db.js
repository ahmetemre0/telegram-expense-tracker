const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");

        // Indexes for fast retrieval
        const User = mongoose.model("User");
        await User.collection.createIndex({ chatId: 1 }, { unique: true });
        await User.collection.createIndex({ "expenses.date": 1 });
        await User.collection.createIndex({ "expenses.category": 1 });

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
