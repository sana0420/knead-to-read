import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Userlayout from './components/Layout/UserLayout'
import Home from './pages/Home.JSX'
import { Toaster } from 'sonner'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ProductDetails from './components/Products/ProductDetail.jsx'
import Checkout from './components/Cart/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentCancel from './pages/PaymentCancel.jsx'
import OrderDetailsPage from './pages/OrderDetailsPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import AdminLayout from './components/Admin/AdminLayout.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import UserManagment from './components/Admin/UserManagment.jsx'
import ProductManagement from './components/Admin/ProductManagement.jsx'
import EditProductPage from './components/Admin/EditProductPage.jsx'
import OrderManagement from './components/Admin/OrderManagement.jsx'
import SubscriptionPlans from './pages/SubscriptionPlans.jsx'
import AdminProductList from './components/Admin/AdminProductList.jsx'
import SubscriptionPlanConfig from './components/Admin/SubscriptionPlanConfig.jsx'
import { Provider } from "react-redux";
import store from "./redux/store"
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Userlayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pairing" element={<CollectionPage />} />
            <Route path="/pairing/oven" element={<CollectionPage />} />
            <Route path="/pairing/library" element={<CollectionPage />} />
            <Route path="/pairing/plans" element={<SubscriptionPlans />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/payment-cancel' element={<PaymentCancel />} />
            <Route path='/order-confirmation' element={<OrderConfirmation />} />
            <Route path='/order/:id' element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            {/* Add more routes as needed */}
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='users' element={<UserManagment />} />
            <Route path='products' element={<AdminProductList />} />
            <Route path='products/new' element={<EditProductPage />} />
            <Route path='products/:id/edit' element={<EditProductPage />} />
            <Route path='orders' element={<OrderManagement />} />
            <Route path='subscriptions' element={<SubscriptionPlanConfig />} />
            <Route path='subscriptions/plans' element={<SubscriptionPlanConfig />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App