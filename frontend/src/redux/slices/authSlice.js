import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info from localStorage if available
const userFromLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Check for an existing guest id in local storage or generate new
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromLocalStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Asynchronous thunk to login user
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.BACKEND_URL}/api/users/login`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// Registration thunk
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.BACKEND_URL}/api/users/register`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
});

// Update profile thunk
export const updateProfile = createAsyncThunk("auth/updateProfile", async (userData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("userToken");
        const response = await axios.put(`${import.meta.env.BACKEND_URL}/api/users/profile`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
});

// Get profile thunk
export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No token found");
        const response = await axios.get(`${import.meta.env.BACKEND_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
});

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // Reset guest id on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.removeItem("usertoken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Profile
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
            });
    }
});

export const { logout, generateNewGuestId, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
