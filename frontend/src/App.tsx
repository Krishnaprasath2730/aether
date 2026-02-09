import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import MainLayout from './Components/Layout/MainLayout';
import CheckoutLayout from './Components/Layout/CheckoutLayout';
import Home from './Components/Pages/Home';
import Shop from './Components/Pages/Shop';
import ProductDetails from './Components/Pages/ProductDetails';
import Wishlist from './Components/Pages/Wishlist';
import Login from './Components/Pages/Login';
import Signup from './Components/Pages/Signup';
import OTPVerification from './Components/Pages/OTPVerification';
import OAuthCallback from './Components/Pages/OAuthCallback';
import Account from './Components/Pages/Account';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ResetPassword from './Components/Pages/ResetPassword';
import Cart from './Components/Checkout/Cart';
import Shipping from './Components/Checkout/Shipping';
import Payment from './Components/Checkout/Payment';
import Wallet from './Components/Pages/Wallet';
import AdminDashboard from './Components/Pages/AdminDashboard';
import OutletHub from './Components/Pages/OutletHub';
import Rewards from './Components/Pages/Rewards';
import { CoBrowseProvider } from './Components/Features/CoBrowsing/CoBrowseContext';
import CoBrowseManager from './Components/Features/CoBrowsing/CoBrowseManager';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as DynamicThemeProvider, useTheme } from './context/ThemeContext';
import { ScratchCardProvider } from './context/ScratchCardContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirects to account if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/account" />;
};

const AppContent: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: currentTheme.backgroundGradient,
      transition: 'background 0.5s ease'
    }}>
      <CoBrowseManager />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main Storefront Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="outlet" element={<OutletHub />} />
          <Route path="rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
          <Route path="account/*" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Route>

        {/* Secure Checkout Routes */}
        <Route path="/checkout" element={<CheckoutLayout />}>
          <Route path="cart" element={<Cart />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScratchCardProvider>
              <CheckoutProvider>
                <CoBrowseProvider>
                  <DynamicThemeProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </DynamicThemeProvider>
                </CoBrowseProvider>
              </CheckoutProvider>
            </ScratchCardProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
