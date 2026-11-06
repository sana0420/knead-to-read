import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

//Retrieve user info from localStorage if available

const userFromLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// check for an existing guest id in the local storage or generate new findOne
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

//initial state
const initialState = {
    user: userFromLocalStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};
//asynchronous thunk to login user
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData)
        localStorage.setItem("userInfo", JSON.stringify(response.data.user))
        localStorage.setItem("userToken", response.data.token)

        return response.data.user; //return the user object from the response
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})
//registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData)
        localStorage.setItem("userInfo", JSON.stringify(response.data.user))
        localStorage.setItem("userToken", response.data.token)

        return response.data.user; //return the user object from the response
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})
//slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;//reset guest id on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.removeItem("usertoken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload.message;
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = true;
                state.error = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload.message;
            })
    }
})
export const { logout, generateNewGuestId } = authSlice.actions
export default authSlice.reducer;