const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SubscriptionPlan = require('./models/SubscriptionPlan');
const subscriptionPlansData = require('./data/subscriptionPlans');
dotenv.config();


const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        await SubscriptionPlan.deleteMany({});
        await SubscriptionPlan.insertMany(subscriptionPlansData);
        console.log("Subscription Plans Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};
seedDB();