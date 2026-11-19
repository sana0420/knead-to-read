import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductsByFilters = createAsyncThunk(
    "products/fetchByFilters",
    async ({
        collection,
        discountPrice,
        numReviews,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        ratings,
        countInStock,
        images,
        name,
        description,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        limit
    }) => {
        const query = new URLSearchParams();

        // FIX: If collection or category exist, map them together onto the dynamic DB "category" query string key
        const activeCategory = category || collection;
        if (activeCategory) query.append("category", activeCategory);

        if (discountPrice) query.append("discountPrice", discountPrice);
        if (numReviews) query.append("numReviews", numReviews);
        if (tags) query.append("tags", tags);
        if (metaTitle) query.append("metaTitle", metaTitle);
        if (metaDescription) query.append("metaDescription", metaDescription);
        if (metaKeywords) query.append("metaKeywords", metaKeywords);
        if (ratings) query.append("ratings", ratings);
        if (countInStock) query.append("countInStock", countInStock);
        if (images) query.append("images", images);
        if (name) query.append("name", name);
        if (description) query.append("description", description);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (limit) query.append("limit", limit);
        if (search) query.append("search", search);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );
        return response.data;
    }
);

// async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductsDetails",
    async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        return response.data;
    }
);

// async thunk to update products
export const updateProducts = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                }
            }
        );
        return response.data;
    }
);

// async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
        );
        return response.data;
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            collection: "",
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                collection: "",
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // handle fetching products with filter
            .addCase(fetchProductsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // handle fetching single product details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // handle updating product
            .addCase(updateProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                state.loading = false;
                const updateProduct = action.payload;
                const index = state.products.findIndex(
                    (product) => product._id === updateProduct._id
                );
                if (index !== -1) {
                    state.products[index] = updateProduct;
                }
            })
            .addCase(updateProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetch similar products
            .addCase(fetchSimilarProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;