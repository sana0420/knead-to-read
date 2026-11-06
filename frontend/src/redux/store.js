import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkoutSlice"
import orderReducer from "./slices/orderSlice"
import adminReducer from "./slices/adminSlice"
import adminProductReducer from "./slices/adminProductSlice"
import adminOrdersReducer from "./slices/adminOrderSlice"
import adminAnalyticsReducer from "./slices/adminAnalyticsSlice"
import adminSubscriptionReducer from "./slices/adminSubscriptionSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProduct: adminProductReducer,
        adminOrders: adminOrdersReducer,
        adminAnalytics: adminAnalyticsReducer,
        adminSubscription: adminSubscriptionReducer,
    },
})

export default store;
