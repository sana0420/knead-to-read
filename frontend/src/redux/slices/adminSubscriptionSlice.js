import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken") || localStorage.getItem("usertoken")}`,
    },
});

export const fetchAdminSubscriptionPlans = createAsyncThunk(
    "adminSubscription/fetchPlans",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/subscriptions/plans`, getAuthHeaders());
            return response.data;
        } catch (error) {
            try {
                const fallback = await axios.get(`${API_URL}/api/subscriptions/plans`, getAuthHeaders());
                return fallback.data;
            } catch (fallbackError) {
                return rejectWithValue(
                    error.response?.data?.message || fallbackError.response?.data?.message || error.message
                );
            }
        }
    }
);

export const updateSubscriptionPlan = createAsyncThunk(
    "adminSubscription/updatePlan",
    async ({ id, planData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/admin/subscriptions/plans/${id}`,
                planData,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            try {
                const fallback = await axios.put(
                    `${API_URL}/api/subscriptions/plans/${id}`,
                    planData,
                    getAuthHeaders()
                );
                return fallback.data;
            } catch (fallbackErr) {
                return rejectWithValue(
                    error.response?.data?.message || fallbackErr.response?.data?.message || error.message
                );
            }
        }
    }
);

export const togglePlanStatus = createAsyncThunk(
    "adminSubscription/toggleStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/api/admin/subscriptions/plans/${id}/toggle-status`,
                {},
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            try {
                const fallback = await axios.patch(
                    `${API_URL}/api/subscriptions/plans/${id}/toggle-status`,
                    {},
                    getAuthHeaders()
                );
                return fallback.data;
            } catch (fallbackErr) {
                return rejectWithValue(
                    error.response?.data?.message || fallbackErr.response?.data?.message || error.message
                );
            }
        }
    }
);

export const createSubscriptionPlan = createAsyncThunk(
    "adminSubscription/createPlan",
    async (planData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/admin/subscriptions/plans`,
                planData,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            try {
                const fallback = await axios.post(
                    `${API_URL}/api/subscriptions/plans`,
                    planData,
                    getAuthHeaders()
                );
                return fallback.data;
            } catch (fallbackErr) {
                return rejectWithValue(
                    error.response?.data?.message || fallbackErr.response?.data?.message || error.message
                );
            }
        }
    }
);

export const deleteSubscriptionPlan = createAsyncThunk(
    "adminSubscription/deletePlan",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${API_URL}/api/admin/subscriptions/plans/${id}`,
                getAuthHeaders()
            );
            return id;
        } catch (error) {
            try {
                await axios.delete(
                    `${API_URL}/api/subscriptions/plans/${id}`,
                    getAuthHeaders()
                );
                return id;
            } catch (fallbackErr) {
                return rejectWithValue(
                    error.response?.data?.message || fallbackErr.response?.data?.message || error.message
                );
            }
        }
    }
);

const adminSubscriptionSlice = createSlice({
    name: "adminSubscription",
    initialState: {
        plans: [],
        loading: false,
        error: null,
        isSaving: false,
        updatingPlanId: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Plans
            .addCase(fetchAdminSubscriptionPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminSubscriptionPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchAdminSubscriptionPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Update Plan
            .addCase(updateSubscriptionPlan.pending, (state, action) => {
                state.isSaving = true;
                state.updatingPlanId = action.meta.arg.id;
            })
            .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
                state.isSaving = false;
                state.updatingPlanId = null;
                const updated = action.payload;
                const index = state.plans.findIndex(
                    (p) => p._id === updated._id || p.planId === updated.planId
                );
                if (index !== -1) {
                    state.plans[index] = updated;
                }
            })
            .addCase(updateSubscriptionPlan.rejected, (state, action) => {
                state.isSaving = false;
                state.updatingPlanId = null;
                state.error = action.payload || action.error.message;
            })

            // Toggle Status
            .addCase(togglePlanStatus.pending, (state, action) => {
                state.updatingPlanId = action.meta.arg;
            })
            .addCase(togglePlanStatus.fulfilled, (state, action) => {
                state.updatingPlanId = null;
                const updated = action.payload;
                const index = state.plans.findIndex(
                    (p) => p._id === updated._id || p.planId === updated.planId
                );
                if (index !== -1) {
                    state.plans[index] = updated;
                }
            })
            .addCase(togglePlanStatus.rejected, (state, action) => {
                state.updatingPlanId = null;
                state.error = action.payload || action.error.message;
            })

            // Create Plan
            .addCase(createSubscriptionPlan.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
                state.isSaving = false;
                state.plans.push(action.payload);
            })
            .addCase(createSubscriptionPlan.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload || action.error.message;
            })

            // Delete Plan
            .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
                state.plans = state.plans.filter(
                    (p) => p._id !== action.payload && p.planId !== action.payload
                );
            });
    },
});

export default adminSubscriptionSlice.reducer;
