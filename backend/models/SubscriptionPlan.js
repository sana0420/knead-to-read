const mongoose = require('mongoose');
const intervalSchema = new mongoose.Schema({
    label: { type: String, required: true },
    price: { type: Number, required: true },
    savings: { type: String, default: null },
    stripePriceId: { type: String, required: true }
}, { _id: false });
const subscriptionPlanSchema = new mongoose.Schema({
    planId: { type: String, required: true, unique: true }, // e.g. 'plan_bookmark'
    name: { type: String, required: true }, // e.g. 'The Bookmark Box'
    badge: { type: String, default: null },
    category: { type: String, enum: ['library', 'oven', 'pairing'], required: true },
    description: { type: String, required: true },
    includes: [{ type: String }],
    intervals: {
        weekly: { type: intervalSchema, default: null },
        biweekly: { type: intervalSchema, default: null },
        monthly: { type: intervalSchema, default: null },
        quarterly: { type: intervalSchema, default: null }
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);