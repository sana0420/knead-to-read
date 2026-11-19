import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("userToken") || localStorage.getItem("usertoken")}`,
});

const ensureArray = (data) => (Array.isArray(data) ? data : []);

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
        }
    }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { status },
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to update order" });
        }
    }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
                { headers: getAuthHeaders() }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to delete order" });
        }
    }
);

const adminOrdersSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                const orders = ensureArray(action.payload);
                state.orders = orders;
                state.totalOrders = orders.length;
                state.totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch orders";
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.error = action.payload?.message || "Failed to update order";
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
                state.totalOrders = state.orders.length;
                state.totalSales = state.orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.error = action.payload?.message || "Failed to delete order";
            });
    },
});

export default adminOrdersSlice.reducer;
