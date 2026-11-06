import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken") || localStorage.getItem("usertoken")}`,
    },
});

export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products`, getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAdminProductById = createAsyncThunk(
    "adminProducts/fetchProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products/${id}`, getAuthHeader());
            return response.data;
        } catch (error) {
            // Fallback to public products endpoint if admin fails
            try {
                const fallback = await axios.get(`${API_URL}/api/products/${id}`);
                return fallback.data;
            } catch (fallbackError) {
                return rejectWithValue(error.response?.data?.message || fallbackError.response?.data?.message || error.message);
            }
        }
    }
);

export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/admin/products`, productData, getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, getAuthHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/admin/products/${id}`, getAuthHeader());
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        currentProduct: null,
        loading: false,
        error: null,
        loadingCurrentProduct: false,
        currentProductError: null,
        isSubmitting: false,
    },
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.currentProductError = null;
            state.loadingCurrentProduct = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : action.payload.products || [];
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Fetch product by ID
            .addCase(fetchAdminProductById.pending, (state) => {
                state.loadingCurrentProduct = true;
                state.currentProductError = null;
                state.currentProduct = null;
            })
            .addCase(fetchAdminProductById.fulfilled, (state, action) => {
                state.loadingCurrentProduct = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchAdminProductById.rejected, (state, action) => {
                state.loadingCurrentProduct = false;
                state.currentProductError = action.payload || action.error.message;
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isSubmitting = false;
                const newProduct = action.payload.product || action.payload;
                state.products.unshift(newProduct);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload || action.error.message;
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isSubmitting = false;
                const updatedItem = action.payload.product || action.payload;
                const index = state.products.findIndex(
                    (product) => product._id === updatedItem._id
                );
                if (index !== -1) {
                    state.products[index] = updatedItem;
                }
                state.currentProduct = updatedItem;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload || action.error.message;
            })

            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
                if (state.currentProduct?._id === action.payload) {
                    state.currentProduct = null;
                }
            });
    },
});

export const { clearCurrentProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;
