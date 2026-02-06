import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import MainLayout from './Components/Layout/MainLayout';
import CheckoutLayout from './Components/Layout/CheckoutLayout';
import Home from './Components/Pages/Home';
import Shop from './Components/Pages/Shop';
import ProductDetails from './Components/Pages/ProductDetails';
import Wishlist from './Components/Pages/Wishlist';
import Cart from './Components/Checkout/Cart';
import Shipping from './Components/Checkout/Shipping';
import Payment from './Components/Checkout/Payment';
import { CoBrowseProvider } from './Components/Features/CoBrowsing/CoBrowseContext';
import CoBrowseManager from './Components/Features/CoBrowsing/CoBrowseManager';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CheckoutProvider } from './context/CheckoutContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <WishlistProvider>
          <CheckoutProvider>
            <CoBrowseProvider>
              <Router>
                <CoBrowseManager />
                <Routes>
                  {/* Main Storefront Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="account/*" element={<AccountPlaceholder />} />
                  </Route>

                  {/* Secure Checkout Routes */}
                  <Route path="/checkout" element={<CheckoutLayout />}>
                    <Route path="cart" element={<Cart />} />
                    <Route path="shipping" element={<Shipping />} />
                    <Route path="payment" element={<Payment />} />
                  </Route>
                </Routes>
              </Router>
            </CoBrowseProvider>
          </CheckoutProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

// Placeholder for account page
function AccountPlaceholder() {
  return (
    <div style={{ 
      padding: '80px 20px', 
      textAlign: 'center', 
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2 style={{ marginBottom: '16px', fontFamily: '"Playfair Display", serif' }}>My Account</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Account management coming soon</p>
      <a 
        href="/shop" 
        style={{ 
          backgroundColor: '#2C2C2C', 
          color: 'white', 
          padding: '12px 32px', 
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Continue Shopping
      </a>
    </div>
  );
}

export default App;
