import React, { useState, useEffect } from 'react';

const FREQUENCY_ORDER = ['weekly', 'biweekly', 'monthly', 'quarterly'];

const FREQUENCY_LABELS = {
    weekly: 'Weekly',
    biweekly: 'Bi-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
};

const CATEGORY_ICONS = {
    library: '📚',
    oven: '🥐',
    pairing: '✨',
};

export default function SubscriptionPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFrequency, setSelectedFrequency] = useState('monthly');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/plans`)
            .then(res => {
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                return res.json();
            })
            .then(data => {
                setPlans(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching plans:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Filter out inactive plans (isActive === false)
    const activePlans = plans.filter(plan => plan.isActive !== false);

    // Get all frequencies that exist across all active plans
    const availableFrequencies = FREQUENCY_ORDER.filter(freq =>
        activePlans.some(plan => plan.intervals?.[freq] != null)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-booksdos flex items-center justify-center">
                <div className="text-center text-ktr-blue">
                    <div className="text-4xl mb-4 animate-pulse">📦</div>
                    <p className="text-lg tracking-wide">Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-booksdos flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-lg font-semibold">Could not load plans.</p>
                    <p className="text-sm text-gray-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-booksdos text-ktr-blue">
            {/* ── Hero ── */}
            <div className="text-center py-16 px-6">
                <p className="text-sm uppercase tracking-[0.3em] text-ktr-green font-semibold mb-3">
                    Knead to Read Subscriptions
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Your Monthly Literary &amp; Bakery Box
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Choose a plan that matches your rhythm. Cancel or change frequency anytime.
                </p>
            </div>

            {/* ── Frequency Toggle ── */}
            {availableFrequencies.length > 1 && (
                <div className="flex justify-center mb-12 px-4">
                    <div className="inline-flex bg-[#FFFDEB] border border-gray-200 rounded-full p-1 shadow-sm gap-1">
                        {availableFrequencies.map(freq => (
                            <button
                                key={freq}
                                onClick={() => setSelectedFrequency(freq)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedFrequency === freq
                                    ? 'bg-ktr-blue text-white shadow'
                                    : 'text-gray-500 hover:text-ktr-blue'
                                    }`}
                            >
                                {FREQUENCY_LABELS[freq]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Plan Cards ── */}
            <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {activePlans.map(plan => {
                    const interval = plan.intervals?.[selectedFrequency];
                    // If this plan doesn't offer the selected frequency, find the nearest available one
                    const displayInterval = interval
                        ?? FREQUENCY_ORDER
                            .map(f => plan.intervals?.[f])
                            .find(Boolean);

                    const isPopular = plan.badge === 'Most Popular';

                    return (
                        <div
                            key={plan.planId}
                            className={`relative flex flex-col bg-[#FFFDEB] rounded-2xl shadow-lg border transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden ${isPopular ? 'border-ktr-blue' : 'border-gray-100'
                                }`}
                        >
                            {/* Popular badge */}
                            {isPopular && (
                                <div className="absolute top-0 left-0 right-0 bg-ktr-blue text-white text-center text-xs font-semibold py-1.5 tracking-widest uppercase">
                                    ⭐ Most Popular
                                </div>
                            )}

                            <div className={`p-7 flex flex-col flex-1 ${isPopular ? 'pt-10' : ''}`}>
                                {/* Icon + category */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">{CATEGORY_ICONS[plan.category] ?? '📦'}</span>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                        {plan.category}
                                    </span>
                                    {plan.badge && !isPopular && (
                                        <span className="ml-auto text-xs bg-ktr-skin text-ktr-blue px-2 py-0.5 rounded-full font-medium">
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Plan name */}
                                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{plan.description}</p>

                                {/* Price */}
                                {displayInterval ? (
                                    <div className="mb-6">
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-bold text-ktr-blue">
                                                ${displayInterval.price}
                                            </span>
                                            <span className="text-gray-400 text-sm mb-1">
                                                / {displayInterval.label?.toLowerCase() ?? selectedFrequency}
                                            </span>
                                        </div>
                                        {displayInterval.savings && (
                                            <span className="inline-block mt-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                {displayInterval.savings}
                                            </span>
                                        )}
                                        {!interval && (
                                            <p className="text-xs text-amber-600 mt-1">
                                                * Not available {FREQUENCY_LABELS[selectedFrequency]?.toLowerCase()} — showing {displayInterval.label?.toLowerCase()} price
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mb-6 text-gray-400 text-sm">Price not available</div>
                                )}

                                {/* Divider */}
                                <hr className="border-gray-100 mb-5" />

                                {/* Includes */}
                                <div className="flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                        What's included
                                    </p>
                                    <ul className="space-y-2">
                                        {plan.includes?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-ktr-green font-bold mt-0.5">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <button
                                    className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-150 ${isPopular
                                        ? 'bg-ktr-blue text-ktr-skin hover:opacity-90'
                                        : 'bg-ktr-pink text-ktr-blue border border-ktr-blue hover:bg-ktr-blue hover:text-white'
                                        }`}
                                >
                                    Subscribe — {displayInterval ? `$${displayInterval.price}` : 'View plan'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Empty state ── */}
            {activePlans.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">No subscription plans available right now.</p>
                    <p className="text-sm mt-2">Check back soon!</p>
                </div>
            )}
        </div>
    );
}