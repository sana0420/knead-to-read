import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    fetchAdminSubscriptionPlans,
    updateSubscriptionPlan,
    togglePlanStatus,
    createSubscriptionPlan,
    deleteSubscriptionPlan,
} from '../../redux/slices/adminSubscriptionSlice';
import {
    FaSyncAlt,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCopy,
    FaCheck,
    FaCheckCircle,
    FaTimes,
    FaTimesCircle,
    FaBoxOpen,
    FaCalendarAlt,
    FaCreditCard,
    FaThLarge,
    FaTable,
    FaSpinner,
    FaArrowUp,
    FaArrowDown,
    FaBook,
    FaUtensils,
    FaGift,
    FaListAlt,
} from 'react-icons/fa';

const INTERVAL_KEYS = [
    { key: 'weekly', label: 'Weekly', defaultPrice: 28.99 },
    { key: 'biweekly', label: 'Bi-Weekly', defaultPrice: 30.99 },
    { key: 'monthly', label: 'Monthly', defaultPrice: 32.99 },
    { key: 'quarterly', label: 'Quarterly', defaultPrice: 89.99 },
];

const CATEGORY_MAP = {
    library: { label: 'Library (Books)', icon: FaBook, color: 'text-blue-800 bg-blue-100 border-blue-300' },
    oven: { label: 'Oven (Pastries)', icon: FaUtensils, color: 'text-amber-800 bg-amber-100 border-amber-300' },
    pairing: { label: 'Pairing (Combos)', icon: FaGift, color: 'text-emerald-800 bg-emerald-100 border-emerald-300' },
};

const SUGGESTED_INCLUDES = [
    '1 Curated Classic Novel (Library collection)',
    '2 Matched Bakery Pastries (Pairing collection)',
    '4 Handcrafted Bakery Items (Oven collection)',
    '1 Collectible Knead to Read Bookmark',
    'Literary Tasting Notes Card',
    "Digital Reader's Discussion Guide",
    "Baker's Secret Reheating & Storage Card",
    'Free Local Shipping / Priority Pickup',
];

const SubscriptionPlanConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { plans, loading, error, isSaving, updatingPlanId } = useSelector(
        (state) => state.adminSubscription
    );

    // Active sub-tab: 'plans' | 'schedules'
    const [subTab, setSubTab] = useState(
        location.pathname.includes('/plans') ? 'plans' : 'plans'
    );
    // View mode for plans: 'cards' | 'table'
    const [viewMode, setViewMode] = useState('cards');

    // Filter by category
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Edit modal state
    const [editingPlan, setEditingPlan] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form data for Edit / Create modal
    const [formData, setFormData] = useState({
        planId: '',
        name: '',
        badge: '',
        category: 'pairing',
        description: '',
        includes: [],
        intervals: {
            weekly: null,
            biweekly: null,
            monthly: null,
            quarterly: null,
        },
        isActive: true,
    });

    // New include item input
    const [newIncludeText, setNewIncludeText] = useState('');

    useEffect(() => {
        dispatch(fetchAdminSubscriptionPlans());
    }, [dispatch]);

    // Handle copying Stripe ID
    const handleCopyStripeId = (stripePriceId) => {
        if (!stripePriceId) return;
        navigator.clipboard.writeText(stripePriceId);
        toast.success(`Copied "${stripePriceId}" to clipboard!`);
    };

    // Toggle active state
    const handleToggleStatus = async (plan) => {
        try {
            await dispatch(togglePlanStatus(plan._id || plan.planId)).unwrap();
            toast.success(`Plan "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Inactive'}`);
        } catch (err) {
            toast.error(`Status update failed: ${err}`);
        }
    };

    // Open Edit Modal
    const handleOpenEditModal = (plan) => {
        setEditingPlan(plan);
        setFormData({
            planId: plan.planId,
            name: plan.name || '',
            badge: plan.badge || '',
            category: plan.category || 'pairing',
            description: plan.description || '',
            includes: Array.isArray(plan.includes) ? [...plan.includes] : [],
            intervals: {
                weekly: plan.intervals?.weekly ? { ...plan.intervals.weekly } : null,
                biweekly: plan.intervals?.biweekly ? { ...plan.intervals.biweekly } : null,
                monthly: plan.intervals?.monthly ? { ...plan.intervals.monthly } : null,
                quarterly: plan.intervals?.quarterly ? { ...plan.intervals.quarterly } : null,
            },
            isActive: Boolean(plan.isActive),
        });
        setNewIncludeText('');
    };

    // Open Create Modal
    const handleOpenCreateModal = () => {
        setEditingPlan(null);
        setFormData({
            planId: '',
            name: '',
            badge: 'New Box',
            category: 'pairing',
            description: 'Curated monthly literary and artisan bakery box delivered fresh.',
            includes: [
                '1 Curated Classic Novel',
                '2 Matched Bakery Pastries',
                'Literary Tasting Notes Card',
            ],
            intervals: {
                weekly: {
                    label: 'Weekly',
                    price: 28.99,
                    savings: 'Save 12%',
                    stripePriceId: 'price_new_weekly',
                },
                biweekly: {
                    label: 'Bi-Weekly',
                    price: 30.99,
                    savings: 'Save 6%',
                    stripePriceId: 'price_new_biweekly',
                },
                monthly: {
                    label: 'Monthly',
                    price: 32.99,
                    savings: null,
                    stripePriceId: 'price_new_monthly',
                },
                quarterly: {
                    label: 'Quarterly',
                    price: 89.99,
                    savings: 'Save 10%',
                    stripePriceId: 'price_new_quarterly',
                },
            },
            isActive: true,
        });
        setNewIncludeText('');
        setIsCreateModalOpen(true);
    };

    // --- Includes List Editor Helpers ---
    const handleAddInclude = (text) => {
        const item = text.trim();
        if (!item) return;
        if (formData.includes.includes(item)) {
            toast.error('Item is already in includes list');
            return;
        }
        setFormData((prev) => ({
            ...prev,
            includes: [...prev.includes, item],
        }));
        setNewIncludeText('');
    };

    const handleRemoveInclude = (idx) => {
        setFormData((prev) => ({
            ...prev,
            includes: prev.includes.filter((_, i) => i !== idx),
        }));
    };

    const handleMoveInclude = (fromIdx, toIdx) => {
        if (toIdx < 0 || toIdx >= formData.includes.length) return;
        setFormData((prev) => {
            const list = [...prev.includes];
            const [moved] = list.splice(fromIdx, 1);
            list.splice(toIdx, 0, moved);
            return { ...prev, includes: list };
        });
    };

    const handleUpdateIncludeText = (idx, value) => {
        setFormData((prev) => {
            const list = [...prev.includes];
            list[idx] = value;
            return { ...prev, includes: list };
        });
    };

    // --- Interval Pricing Matrix Editor Helpers ---
    const handleToggleIntervalEnabled = (key, label, defaultPrice) => {
        setFormData((prev) => {
            const current = prev.intervals[key];
            if (current) {
                // Disable interval
                return {
                    ...prev,
                    intervals: { ...prev.intervals, [key]: null },
                };
            } else {
                // Enable interval
                return {
                    ...prev,
                    intervals: {
                        ...prev.intervals,
                        [key]: {
                            label,
                            price: defaultPrice,
                            savings: null,
                            stripePriceId: `price_1P_${formData.name ? formData.name.replace(/\s+/g, '_').toUpperCase() : 'PLAN'}_${key.toUpperCase()}`,
                        },
                    },
                };
            }
        });
    };

    const handleIntervalFieldChange = (key, field, value) => {
        setFormData((prev) => {
            const existing = prev.intervals[key] || {
                label: key,
                price: 0,
                savings: null,
                stripePriceId: '',
            };
            return {
                ...prev,
                intervals: {
                    ...prev.intervals,
                    [key]: {
                        ...existing,
                        [field]: field === 'price' ? (value === '' ? '' : Number(value)) : value,
                    },
                },
            };
        });
    };

    // Save Edit or Create
    const handleSavePlan = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Plan name is required');
            return;
        }

        const payload = {
            ...formData,
            name: formData.name.trim(),
            badge: formData.badge ? formData.badge.trim() : null,
            includes: formData.includes.filter((i) => i && i.trim().length > 0),
        };

        try {
            if (editingPlan) {
                await dispatch(
                    updateSubscriptionPlan({
                        id: editingPlan._id || editingPlan.planId,
                        planData: payload,
                    })
                ).unwrap();
                toast.success('Subscription plan updated successfully!');
                setEditingPlan(null);
            } else {
                await dispatch(createSubscriptionPlan(payload)).unwrap();
                toast.success('Subscription plan created successfully!');
                setIsCreateModalOpen(false);
            }
        } catch (err) {
            toast.error(`Save failed: ${err}`);
        }
    };

    // Delete Plan
    const handleDeletePlan = async (plan) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${plan.name}"? Active subscribers will need to be remapped.`
            )
        ) {
            try {
                await dispatch(deleteSubscriptionPlan(plan._id || plan.planId)).unwrap();
                toast.success('Plan deleted');
                if (editingPlan?._id === plan._id) setEditingPlan(null);
            } catch (err) {
                toast.error(`Delete failed: ${err}`);
            }
        }
    };

    // Filter plans
    const filteredPlans = (plans || []).filter((plan) => {
        if (categoryFilter === 'all') return true;
        return plan.category === categoryFilter;
    });

    if (loading && (!plans || plans.length === 0)) {
        return (
            <div className="max-w-6xl mx-auto p-6 text-center py-24">
                <FaSpinner className="inline-block animate-spin text-4xl text-ktr-blue mb-4" />
                <p className="text-ktr-blue font-bold text-lg">Loading subscription plan configurations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24">
            {/* Top Navigation & Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ktr-blue/30 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-ktr-green/20 border border-ktr-green/40 text-ktr-green">
                            Stripe Sync Active
                        </span>
                        <span className="text-xs text-ktr-blue/70 font-medium">
                            {plans?.length || 0} Dynamic Plans in DB
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-ktr-blue mt-1 flex items-center gap-2">
                        <FaSyncAlt className="text-ktr-blue text-xl sm:text-2xl" />
                        <span>Subscription Plan Management</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-ktr-blue/80 mt-1">
                        Dedicated hub for managing box structures, Stripe Price IDs, and subscriber fulfillment schedules.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                        type="button"
                        onClick={() => dispatch(fetchAdminSubscriptionPlans())}
                        className="p-2.5 rounded-xl border border-ktr-blue bg-ktr-skin text-ktr-blue hover:bg-ktr-blue hover:text-ktr-skin transition cursor-pointer shadow-xs"
                        title="Refresh plans from database"
                    >
                        <FaSyncAlt />
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-ktr-blue text-ktr-skin rounded-xl font-bold hover:bg-ktr-blue/90 shadow-md transition cursor-pointer border border-ktr-blue"
                    >
                        <FaPlus className="text-xs" />
                        <span>Create New Plan</span>
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-ktr-skin border-2 border-ktr-pink text-ktr-blue flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-500 text-lg flex-shrink-0" />
                        <span className="text-sm font-semibold">{error}</span>
                    </div>
                    <button
                        onClick={() => dispatch(fetchAdminSubscriptionPlans())}
                        className="text-xs underline font-bold hover:opacity-80 cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Sub-Hub Navigation & Category Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                {/* Hub Tabs */}
                <div className="flex items-center bg-ktr-skin p-1.5 rounded-2xl border border-ktr-blue/40 shadow-xs">
                    <button
                        type="button"
                        onClick={() => {
                            setSubTab('plans');
                            navigate('/admin/subscriptions/plans');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            subTab === 'plans'
                                ? 'bg-ktr-blue text-ktr-skin shadow-sm'
                                : 'text-ktr-blue hover:bg-ktr-pink/30'
                        }`}
                    >
                        <FaListAlt />
                        <span>Plan Configurations</span>
                        <span className="ml-1 text-[10px] bg-ktr-skin/40 px-1.5 py-0.2 rounded-full">
                            {plans?.length || 0}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSubTab('schedules');
                            navigate('/admin/subscriptions');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            subTab === 'schedules'
                                ? 'bg-ktr-blue text-ktr-skin shadow-sm'
                                : 'text-ktr-blue hover:bg-ktr-pink/30'
                        }`}
                    >
                        <FaCalendarAlt />
                        <span>Subscriber Schedules & Fulfillment</span>
                    </button>
                </div>

                {/* Right controls: Category filter & View mode */}
                {subTab === 'plans' && (
                    <div className="flex items-center gap-3">
                        {/* Category Filter */}
                        <div className="flex items-center gap-1 bg-ktr-skin p-1 rounded-xl border border-ktr-blue/30 text-xs font-semibold">
                            {['all', 'pairing', 'oven', 'library'].map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                                        categoryFilter === cat
                                            ? 'bg-ktr-blue text-ktr-skin font-bold'
                                            : 'text-ktr-blue hover:bg-ktr-pink/20'
                                    }`}
                                >
                                    {cat === 'all' ? 'All' : cat}
                                </button>
                            ))}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-ktr-skin p-1 rounded-xl border border-ktr-blue/30 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setViewMode('cards')}
                                title="Cards View"
                                className={`p-1.5 rounded-lg cursor-pointer ${
                                    viewMode === 'cards' ? 'bg-ktr-blue text-ktr-skin' : 'text-ktr-blue hover:bg-ktr-pink/20'
                                }`}
                            >
                                <FaThLarge />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                title="Table Matrix View"
                                className={`p-1.5 rounded-lg cursor-pointer ${
                                    viewMode === 'table' ? 'bg-ktr-blue text-ktr-skin' : 'text-ktr-blue hover:bg-ktr-pink/20'
                                }`}
                            >
                                <FaTable />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* SUB-TAB 1: PLAN CONFIGURATIONS (/admin/subscriptions/plans) */}
            {/* ============================================================== */}
            {subTab === 'plans' && (
                <>
                    {/* CARDS VIEW */}
                    {viewMode === 'cards' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredPlans.map((plan) => {
                                const catMeta = CATEGORY_MAP[plan.category] || CATEGORY_MAP.pairing;
                                const CatIcon = catMeta.icon;
                                const isToggling = updatingPlanId === (plan._id || plan.planId);

                                return (
                                    <div
                                        key={plan.planId || plan._id}
                                        className={`bg-ktr-skin/90 rounded-2xl border-2 shadow-md overflow-hidden flex flex-col justify-between transition-all ${
                                            plan.isActive
                                                ? 'border-ktr-blue/40 ring-1 ring-ktr-blue/20'
                                                : 'border-gray-300 opacity-75'
                                        }`}
                                    >
                                        {/* Card Top Banner */}
                                        <div className="p-5 bg-ktr-blue text-ktr-skin flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-ktr-skin text-ktr-blue text-lg">
                                                    <CatIcon />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold text-ktr-skin">{plan.name}</h3>
                                                        {plan.badge && (
                                                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase bg-ktr-pink text-ktr-blue border border-ktr-skin/40">
                                                                {plan.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-ktr-skin/80 font-mono mt-0.5">
                                                        planId: {plan.planId}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Active Toggle & Edit Action */}
                                            <div className="flex items-center gap-2.5">
                                                {/* Active Toggle Switch */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(plan)}
                                                    disabled={isToggling}
                                                    title={plan.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                                                        plan.isActive
                                                            ? 'bg-ktr-green/20 text-white border-ktr-green/50 hover:bg-ktr-green/40'
                                                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {isToggling ? (
                                                        <FaSpinner className="animate-spin text-xs" />
                                                    ) : plan.isActive ? (
                                                        <FaCheckCircle className="text-green-400" />
                                                    ) : (
                                                        <FaTimesCircle className="text-gray-400" />
                                                    )}
                                                    <span>{plan.isActive ? 'Active' : 'Inactive'}</span>
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditModal(plan)}
                                                    className="p-2 rounded-xl bg-ktr-skin text-ktr-blue hover:bg-ktr-pink hover:text-white transition cursor-pointer shadow-xs"
                                                    title="Edit Plan Structure"
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 space-y-5 flex-1">
                                            {/* Description */}
                                            <p className="text-xs text-ktr-blue/80 font-medium leading-relaxed">
                                                {plan.description}
                                            </p>

                                            {/* INTERVAL PRICING MATRIX */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ktr-blue flex items-center gap-1.5">
                                                        <FaCreditCard />
                                                        <span>Interval Pricing Matrix</span>
                                                    </h4>
                                                    <span className="text-[11px] text-ktr-blue/60 font-semibold">
                                                        Synced to Stripe Price IDs
                                                    </span>
                                                </div>

                                                <div className="overflow-x-auto rounded-xl border border-ktr-blue/30 bg-white/90 shadow-2xs">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-ktr-blue/10 text-ktr-blue uppercase font-bold text-[10px] tracking-wider border-b border-ktr-blue/20">
                                                            <tr>
                                                                <th className="py-2.5 px-3">Interval</th>
                                                                <th className="py-2.5 px-3">Price</th>
                                                                <th className="py-2.5 px-3">Savings Badge</th>
                                                                <th className="py-2.5 px-3">Stripe Price ID</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                                                            {INTERVAL_KEYS.map((tier) => {
                                                                const item = plan.intervals?.[tier.key];
                                                                if (!item) {
                                                                    return (
                                                                        <tr key={tier.key} className="opacity-40 bg-gray-50/50">
                                                                            <td className="py-2 px-3 font-semibold text-gray-500">
                                                                                {tier.label}
                                                                            </td>
                                                                            <td className="py-2 px-3 text-gray-400">—</td>
                                                                            <td className="py-2 px-3 text-gray-400 italic text-[11px]">
                                                                                Not Offered
                                                                            </td>
                                                                            <td className="py-2 px-3 text-gray-400 font-mono text-[10px]">
                                                                                —
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }

                                                                return (
                                                                    <tr key={tier.key} className="hover:bg-ktr-skin/40 transition">
                                                                        <td className="py-2.5 px-3 font-bold text-ktr-blue">
                                                                            {tier.label}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 font-extrabold text-ktr-blue">
                                                                            ${Number(item.price).toFixed(2)}
                                                                        </td>
                                                                        <td className="py-2.5 px-3">
                                                                            {item.savings ? (
                                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ktr-green/20 text-ktr-green border border-ktr-green/30">
                                                                                    {item.savings}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-gray-400 text-xs italic">
                                                                                    None
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-2.5 px-3">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <code className="text-[11px] font-mono text-ktr-blue bg-ktr-skin px-1.5 py-0.5 rounded border border-ktr-blue/20">
                                                                                    {item.stripePriceId}
                                                                                </code>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleCopyStripeId(item.stripePriceId)
                                                                                    }
                                                                                    title="Copy Stripe Price ID"
                                                                                    className="text-ktr-blue/60 hover:text-ktr-blue p-1 cursor-pointer"
                                                                                >
                                                                                    <FaCopy className="text-xs" />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* INCLUDES LIST */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ktr-blue flex items-center gap-1.5">
                                                        <FaBoxOpen />
                                                        <span>Package Inclusions ({plan.includes?.length || 0})</span>
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(plan)}
                                                        className="text-[11px] text-ktr-blue font-bold hover:underline cursor-pointer"
                                                    >
                                                        Modify Bullet Points
                                                    </button>
                                                </div>

                                                <ul className="space-y-1.5 bg-white/70 p-3 rounded-xl border border-ktr-blue/20">
                                                    {(plan.includes || []).map((inc, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-800 font-medium">
                                                            <span className="text-ktr-green font-bold mt-0.5">✓</span>
                                                            <span>{inc}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="p-4 bg-ktr-blue/5 border-t border-ktr-blue/15 flex items-center justify-between">
                                            <span className="text-xs text-ktr-blue/70 font-semibold">
                                                Category: <strong className="capitalize">{plan.category}</strong>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditModal(plan)}
                                                    className="px-3.5 py-1.5 bg-ktr-blue text-ktr-skin rounded-lg text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer shadow-xs"
                                                >
                                                    Edit Plan Matrix
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePlan(plan)}
                                                    className="p-1.5 text-red-500 hover:text-red-700 text-xs cursor-pointer ml-1"
                                                    title="Delete plan"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* TABLE VIEW (Matrix across all plans) */}
                    {viewMode === 'table' && (
                        <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md overflow-hidden">
                            <div className="p-4 bg-ktr-blue text-ktr-skin font-bold text-sm flex items-center justify-between">
                                <span>Complete Plans & Pricing Matrix Table</span>
                                <span className="text-xs opacity-80">{filteredPlans.length} Total Plans</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs divide-y divide-ktr-blue/20">
                                    <thead className="bg-ktr-blue/10 text-ktr-blue uppercase font-bold text-[11px]">
                                        <tr>
                                            <th className="py-3 px-4">Plan Name & Category</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4">Weekly ($)</th>
                                            <th className="py-3 px-4">Bi-Weekly ($)</th>
                                            <th className="py-3 px-4">Monthly ($)</th>
                                            <th className="py-3 px-4">Quarterly ($)</th>
                                            <th className="py-3 px-4">Includes</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/60 bg-white/80 font-medium text-gray-800">
                                        {filteredPlans.map((plan) => (
                                            <tr key={plan.planId || plan._id} className="hover:bg-ktr-skin/40 transition">
                                                <td className="py-3.5 px-4">
                                                    <div className="font-bold text-ktr-blue text-sm">{plan.name}</div>
                                                    <div className="text-[10px] text-gray-500 capitalize flex items-center gap-1 mt-0.5">
                                                        <span>{plan.category}</span>
                                                        {plan.badge && (
                                                            <span className="bg-ktr-pink/40 text-ktr-blue px-1.5 py-0.2 rounded font-bold">
                                                                {plan.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(plan)}
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border ${
                                                            plan.isActive
                                                                ? 'bg-ktr-green/20 text-ktr-green border-ktr-green/40'
                                                                : 'bg-gray-200 text-gray-600 border-gray-300'
                                                        }`}
                                                    >
                                                        {plan.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                {INTERVAL_KEYS.map((tier) => {
                                                    const item = plan.intervals?.[tier.key];
                                                    return (
                                                        <td key={tier.key} className="py-3.5 px-4">
                                                            {item ? (
                                                                <div>
                                                                    <span className="font-bold text-ktr-blue">
                                                                        ${item.price}
                                                                    </span>
                                                                    {item.savings && (
                                                                        <span className="block text-[10px] text-emerald-700 font-semibold">
                                                                            {item.savings}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 italic text-[11px]">None</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="py-3.5 px-4 text-xs">
                                                    <span className="font-bold text-ktr-blue">
                                                        {plan.includes?.length || 0} items
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(plan)}
                                                        className="text-ktr-blue hover:underline font-bold text-xs cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ============================================================== */}
            {/* SUB-TAB 2: SUBSCRIBER SCHEDULES & QUEUE HUB */}
            {/* ============================================================== */}
            {subTab === 'schedules' && (
                <div className="space-y-6">
                    {/* Schedule Overview Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-ktr-skin/90 rounded-2xl p-5 border-2 border-ktr-blue/30 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-ktr-blue/70">
                                Active Subscription Tiers
                            </p>
                            <p className="text-3xl font-extrabold text-ktr-blue mt-1">
                                {plans.filter((p) => p.isActive).length} / {plans.length}
                            </p>
                            <p className="text-xs text-ktr-green font-semibold mt-1">100% synced with Stripe</p>
                        </div>
                        <div className="bg-ktr-skin/90 rounded-2xl p-5 border-2 border-ktr-blue/30 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-ktr-blue/70">
                                Weekly Fulfillment Cycle
                            </p>
                            <p className="text-3xl font-extrabold text-ktr-blue mt-1">Every Monday</p>
                            <p className="text-xs text-ktr-blue/70 font-semibold mt-1">Bake batches & novel packs</p>
                        </div>
                        <div className="bg-ktr-skin/90 rounded-2xl p-5 border-2 border-ktr-blue/30 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-ktr-blue/70">
                                Monthly Delivery Window
                            </p>
                            <p className="text-3xl font-extrabold text-ktr-blue mt-1">1st of Month</p>
                            <p className="text-xs text-ktr-blue/70 font-semibold mt-1">Curated pairings dispatch</p>
                        </div>
                    </div>

                    {/* Operational Schedule Guide */}
                    <div className="bg-ktr-skin/90 rounded-2xl border-2 border-ktr-blue/30 shadow-md p-6">
                        <h3 className="text-lg font-bold text-ktr-blue mb-2 flex items-center gap-2">
                            <FaCalendarAlt />
                            <span>Subscriber Recurring Schedule Cycles</span>
                        </h3>
                        <p className="text-xs text-ktr-blue/80 mb-6 leading-relaxed">
                            Subscribers are billed on their chosen interval schedule via Stripe Webhooks. Below are the standard operational fulfillment cut-offs:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                {
                                    interval: 'Weekly Subscriptions',
                                    day: 'Every Monday 06:00 AM',
                                    action: 'Bakery Batch Queue',
                                    badge: 'Highest Freshness',
                                },
                                {
                                    interval: 'Bi-Weekly Subscriptions',
                                    day: 'Alternating Wednesdays',
                                    action: 'Mid-month Pastry Refill',
                                    badge: 'Even Delivery',
                                },
                                {
                                    interval: 'Monthly Subscriptions',
                                    day: '1st of Every Month',
                                    action: 'Full Classic Book + Bakery Box',
                                    badge: 'Core Volume',
                                },
                                {
                                    interval: 'Quarterly Subscriptions',
                                    day: 'Jan 1, Apr 1, Jul 1, Oct 1',
                                    action: 'Deluxe Seasonal Collector Pack',
                                    badge: 'Collector Tier',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/90 rounded-xl p-4 border border-ktr-blue/30 shadow-2xs">
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-ktr-pink/40 text-ktr-blue">
                                        {item.badge}
                                    </span>
                                    <h4 className="font-bold text-ktr-blue text-sm mt-2">{item.interval}</h4>
                                    <p className="text-xs font-semibold text-gray-800 mt-1">{item.day}</p>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.action}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-ktr-blue/20 flex items-center justify-between">
                            <span className="text-xs text-ktr-blue/80 font-medium">
                                Need to modify a plan's Stripe interval pricing?
                            </span>
                            <button
                                type="button"
                                onClick={() => setSubTab('plans')}
                                className="px-4 py-2 bg-ktr-blue text-ktr-skin rounded-xl text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer shadow-xs"
                            >
                                Open Plan Configurations →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* EDIT / CREATE PLAN MODAL (With Matrix & Includes Editor) */}
            {/* ============================================================== */}
            {(editingPlan || isCreateModalOpen) && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-ktr-skin rounded-2xl border-2 border-ktr-blue shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-6">
                        {/* Modal Header */}
                        <div className="p-5 bg-ktr-blue text-ktr-skin flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-ktr-skin">
                                    {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Subscription Plan'}
                                </h3>
                                <p className="text-xs text-ktr-skin/80">
                                    Configure interval price tiers, Stripe IDs, and package bullet inclusions.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingPlan(null);
                                    setIsCreateModalOpen(false);
                                }}
                                className="p-2 rounded-xl text-ktr-skin hover:bg-white/20 transition cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Scrollable Form */}
                        <form onSubmit={handleSavePlan} className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Basic Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1">
                                        Plan Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. The Literary Feast Box"
                                        className="w-full bg-white border border-ktr-blue/40 rounded-xl p-2.5 text-xs font-bold text-ktr-blue focus:outline-none focus:ring-2 focus:ring-ktr-blue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1">
                                        Badge (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        placeholder="e.g. Most Popular"
                                        className="w-full bg-white border border-ktr-blue/40 rounded-xl p-2.5 text-xs font-semibold text-ktr-blue focus:outline-none focus:ring-2 focus:ring-ktr-blue"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white border border-ktr-blue/40 rounded-xl p-2.5 text-xs font-bold text-ktr-blue focus:outline-none focus:ring-2 focus:ring-ktr-blue capitalize"
                                    >
                                        <option value="pairing">Pairing (Curated Combos)</option>
                                        <option value="library">Library (Books Focus)</option>
                                        <option value="oven">Oven (Pastries Focus)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-ktr-blue/30">
                                    <div>
                                        <span className="text-xs font-bold text-ktr-blue block">Active Status</span>
                                        <span className="text-[11px] text-gray-500">
                                            {formData.isActive ? 'Visible to subscribers' : 'Hidden from storefront'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                                            formData.isActive
                                                ? 'bg-ktr-green text-white border-ktr-green'
                                                : 'bg-gray-300 text-gray-700 border-gray-400'
                                        }`}
                                    >
                                        {formData.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ktr-blue mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white border border-ktr-blue/40 rounded-xl p-2.5 text-xs text-ktr-blue font-medium focus:outline-none focus:ring-2 focus:ring-ktr-blue"
                                    required
                                />
                            </div>

                            {/* ============================================================== */}
                            {/* INTERVAL PRICING MATRIX EDITOR */}
                            {/* ============================================================== */}
                            <div className="border-2 border-ktr-blue/30 rounded-2xl p-4 bg-white/60">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ktr-blue mb-2 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <FaCreditCard />
                                        <span>Interval Pricing Matrix & Stripe Price IDs</span>
                                    </span>
                                    <span className="text-[11px] text-gray-500 font-normal">
                                        Toggle interval switch to enable / disable
                                    </span>
                                </h4>

                                <div className="space-y-3 mt-3">
                                    {INTERVAL_KEYS.map((tier) => {
                                        const current = formData.intervals[tier.key];
                                        const isEnabled = Boolean(current);

                                        return (
                                            <div
                                                key={tier.key}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    isEnabled
                                                        ? 'bg-white border-ktr-blue/40 shadow-2xs'
                                                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                    {/* Toggle */}
                                                    <div className="flex items-center gap-2 min-w-[120px]">
                                                        <input
                                                            type="checkbox"
                                                            id={`toggle_${tier.key}`}
                                                            checked={isEnabled}
                                                            onChange={() =>
                                                                handleToggleIntervalEnabled(
                                                                    tier.key,
                                                                    tier.label,
                                                                    tier.defaultPrice
                                                                )
                                                            }
                                                            className="rounded accent-ktr-blue h-4 w-4 cursor-pointer"
                                                        />
                                                        <label
                                                            htmlFor={`toggle_${tier.key}`}
                                                            className="font-bold text-xs text-ktr-blue cursor-pointer"
                                                        >
                                                            {tier.label}
                                                        </label>
                                                    </div>

                                                    {/* Fields if Enabled */}
                                                    {isEnabled && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                                                            {/* Price */}
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">
                                                                    Price ($)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={current.price}
                                                                    onChange={(e) =>
                                                                        handleIntervalFieldChange(
                                                                            tier.key,
                                                                            'price',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full text-xs font-bold border border-gray-300 rounded-lg p-1.5 text-ktr-blue focus:outline-none focus:ring-1 focus:ring-ktr-blue"
                                                                    required
                                                                />
                                                            </div>

                                                            {/* Savings Badge */}
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">
                                                                    Savings Badge (or blank)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={current.savings || ''}
                                                                    onChange={(e) =>
                                                                        handleIntervalFieldChange(
                                                                            tier.key,
                                                                            'savings',
                                                                            e.target.value || null
                                                                        )
                                                                    }
                                                                    placeholder="e.g. Save 12%"
                                                                    className="w-full text-xs border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-ktr-blue"
                                                                />
                                                            </div>

                                                            {/* Stripe Price ID */}
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">
                                                                    Stripe Price ID
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={current.stripePriceId || ''}
                                                                    onChange={(e) =>
                                                                        handleIntervalFieldChange(
                                                                            tier.key,
                                                                            'stripePriceId',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="price_1P_..."
                                                                    className="w-full text-xs font-mono border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-ktr-blue"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ============================================================== */}
                            {/* INCLUDES LIST EDITOR */}
                            {/* ============================================================== */}
                            <div className="border-2 border-ktr-blue/30 rounded-2xl p-4 bg-white/60">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ktr-blue mb-2 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <FaBoxOpen />
                                        <span>Includes List Editor (Package Inclusions)</span>
                                    </span>
                                    <span className="text-[11px] text-gray-500 font-normal">
                                        Modify or reorder package bullet points
                                    </span>
                                </h4>

                                {/* Existing Includes List */}
                                <div className="space-y-2 mt-3 max-h-[220px] overflow-y-auto pr-1">
                                    {formData.includes.map((incText, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-2xs"
                                        >
                                            <span className="text-ktr-green font-bold text-xs">✓</span>
                                            <input
                                                type="text"
                                                value={incText}
                                                onChange={(e) => handleUpdateIncludeText(idx, e.target.value)}
                                                className="flex-1 text-xs border-0 outline-none text-gray-800 font-medium"
                                            />
                                            {/* Reorder & Remove buttons */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveInclude(idx, idx - 1)}
                                                    disabled={idx === 0}
                                                    className="p-1 text-gray-400 hover:text-ktr-blue disabled:opacity-30 cursor-pointer"
                                                    title="Move Up"
                                                >
                                                    <FaArrowUp className="text-[10px]" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMoveInclude(idx, idx + 1)}
                                                    disabled={idx === formData.includes.length - 1}
                                                    className="p-1 text-gray-400 hover:text-ktr-blue disabled:opacity-30 cursor-pointer"
                                                    title="Move Down"
                                                >
                                                    <FaArrowDown className="text-[10px]" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInclude(idx)}
                                                    className="p-1 text-red-400 hover:text-red-600 cursor-pointer ml-1"
                                                    title="Remove bullet point"
                                                >
                                                    <FaTrash className="text-[11px]" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add new bullet point */}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <input
                                        type="text"
                                        value={newIncludeText}
                                        onChange={(e) => setNewIncludeText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddInclude(newIncludeText);
                                            }
                                        }}
                                        placeholder="Add package bullet point (e.g. 1 Curated Classic Novel)..."
                                        className="flex-1 text-xs bg-white border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-ktr-blue"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddInclude(newIncludeText)}
                                        className="px-4 py-2 bg-ktr-blue text-ktr-skin rounded-xl text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                    >
                                        <FaPlus /> Add
                                    </button>
                                </div>

                                {/* Quick Suggestions */}
                                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                                    <span className="text-[10px] text-gray-400 font-bold">Suggestions:</span>
                                    {SUGGESTED_INCLUDES.map((sug, i) => {
                                        const alreadyAdded = formData.includes.includes(sug);
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                disabled={alreadyAdded}
                                                onClick={() => handleAddInclude(sug)}
                                                className={`text-[10px] px-2 py-0.5 rounded-full border transition cursor-pointer ${
                                                    alreadyAdded
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                        : 'bg-white hover:bg-ktr-pink/20 text-ktr-blue border-ktr-blue/30'
                                                }`}
                                            >
                                                {alreadyAdded ? '✓ Added' : `+ ${sug}`}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-ktr-blue/20 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPlan(null);
                                        setIsCreateModalOpen(false);
                                    }}
                                    className="px-5 py-2.5 border border-ktr-blue/40 text-ktr-blue rounded-xl text-xs font-bold hover:bg-ktr-pink/20 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-ktr-blue text-ktr-skin rounded-xl text-xs font-bold hover:bg-ktr-blue/90 cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            <span>Saving Plan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            <span>{editingPlan ? 'Save Plan Changes' : 'Create Plan'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlanConfig;

