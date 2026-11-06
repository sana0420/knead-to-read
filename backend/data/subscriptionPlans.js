const subscriptionPlansData = [
    // ------------------------------------------------------
    // 1. THE BOOKMARK BOX (Library Focus)
    // ------------------------------------------------------
    {
        planId: "plan_bookmark",
        name: "The Bookmark Box",
        badge: "For Book Lovers",
        category: "library",
        description: "A handpicked classic novel from our library collection, complete with exclusive bookmarks and reading notes.",
        includes: [
            "1 Classic Novel (Library collection)",
            "1 Collectible Knead to Read Bookmark",
            "Digital Reader's Discussion Guide"
        ],
        intervals: {
            weekly: null,
            biweekly: null,
            monthly: {
                label: "Monthly",
                price: 14.99,
                savings: null,
                stripePriceId: "price_1P_BOOKMARK_MONTHLY"
            },
            quarterly: {
                label: "Quarterly",
                price: 39.99,
                savings: "Save 11%",
                stripePriceId: "price_1P_BOOKMARK_QUARTERLY"
            }
        },
        isActive: true
    },

    // ------------------------------------------------------
    // 2. THE DAILY CRUMB BOX (Oven Focus)
    // ------------------------------------------------------
    {
        planId: "plan_daily_crumb",
        name: "The Daily Crumb Box",
        badge: "Fresh Pastries",
        category: "oven",
        description: "Freshly baked artisanal treats and loaves crafted to make your coffee breaks and weekend mornings cozy.",
        includes: [
            "4 Handcrafted Bakery Items (Oven collection)",
            "Baker's Secret Reheating & Storage Card",
            "1 Specialty Tea/Coffee Sample Bag"
        ],
        intervals: {
            weekly: {
                label: "Weekly",
                price: 19.99,
                savings: "Best Freshness",
                stripePriceId: "price_1P_CRUMB_WEEKLY"
            },
            biweekly: {
                label: "Bi-Weekly",
                price: 21.49,
                savings: null,
                stripePriceId: "price_1P_CRUMB_BIWEEKLY"
            },
            monthly: {
                label: "Monthly",
                price: 22.99,
                savings: null,
                stripePriceId: "price_1P_CRUMB_MONTHLY"
            },
            quarterly: null
        },
        isActive: true
    },

    // ------------------------------------------------------
    // 3. THE LITERARY FEAST BOX (Pairing Focus)
    // ------------------------------------------------------
    {
        planId: "plan_literary_feast",
        name: "The Literary Feast Box",
        badge: "Most Popular",
        category: "pairing",
        description: "Our signature experience: a full literary classic carefully paired with two fresh bakery treats.",
        includes: [
            "1 Curated Classic Novel",
            "2 Matched Bakery Pastries (Pairing collection)",
            "Literary Tasting Notes Card",
            "Free Local Shipping / Priority Pickup"
        ],
        intervals: {
            weekly: {
                label: "Weekly",
                price: 28.99,
                savings: "Save 12%",
                stripePriceId: "price_1P_FEAST_WEEKLY"
            },
            biweekly: {
                label: "Bi-Weekly",
                price: 30.99,
                savings: "Save 6%",
                stripePriceId: "price_1P_FEAST_BIWEEKLY"
            },
            monthly: {
                label: "Monthly",
                price: 32.99,
                savings: null,
                stripePriceId: "price_1P_FEAST_MONTHLY"
            },
            quarterly: {
                label: "Quarterly",
                price: 89.99,
                savings: "Save 10%",
                stripePriceId: "price_1P_FEAST_QUARTERLY"
            }
        },
        isActive: true
    }
];

module.exports = subscriptionPlansData;