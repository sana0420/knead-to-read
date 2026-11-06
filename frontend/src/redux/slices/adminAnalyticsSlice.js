import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('usertoken')}`,
});

const ensureArray = (data) => (Array.isArray(data) ? data : []);

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
    'adminAnalytics/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();

            const [subsRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/subscriptions`, { headers }),
                axios.get(`${API_URL}/api/admin/orders/today`, { headers }),
                axios.get(`${API_URL}/api/admin/products`, { headers }),
            ]);

            return {
                subscriptions: ensureArray(subsRes.data),
                todaysOrders: ensureArray(ordersRes.data),
                products: ensureArray(productsRes.data),
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard data');
        }
    }
);

const adminAnalyticsSlice = createSlice({
    name: 'adminAnalytics',
    initialState: {
        subscriptions: [],
        todaysOrders: [],
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptions = ensureArray(action.payload.subscriptions);
                state.todaysOrders = ensureArray(action.payload.todaysOrders);
                state.products = ensureArray(action.payload.products);
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminAnalyticsSlice.reducer;
