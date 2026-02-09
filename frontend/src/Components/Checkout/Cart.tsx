import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Divider, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  const finalTotal = totalPrice;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    navigate('/checkout/shipping');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <ShoppingBagOutlinedIcon sx={{ fontSize: 100, color: '#e0e0e0', mb: 3 }} />
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Your bag is empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added anything to your bag yet.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/shop')}
          sx={{ bgcolor: '#2C2C2C', px: 6, py: 1.5, fontWeight: 700 }}
        >
          START SHOPPING
        </Button>
      </Container>
    );
  }

  const handleQuantityChange = (productId: string, size: string, color: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeFromCart(productId, size, color);
    } else if (newQty <= 10) {
      updateQuantity(productId, size, color, newQty);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight={800}>Shopping Bag</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
          </Typography>
        </Box>
        <Button
          variant="text"
          onClick={clearCart}
          sx={{ color: 'text.secondary', '&:hover': { color: '#e91e63' } }}
        >
          Clear All
        </Button>
      </Box>



      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Cart Items */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 60%' }, maxWidth: { lg: '65%' } }}>
          <Box sx={{ bgcolor: isDarkMode ? '#1e1e1e' : 'white', borderRadius: 2, overflow: 'hidden' }}>
            {items.map((item, index) => (
              <Box key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
                  {/* Image */}
                  <Link to={`/product/${item.id}`}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: { xs: 100, sm: 140 },
                        height: { xs: 130, sm: 180 },
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 0.9 }
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flex: 1 }}>
                      <Box>
                        <Typography variant="overline" color="text.secondary">{item.category}</Typography>
                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit', '&:hover': { color: '#D5A249' } }}>
                            {item.name}
                          </Typography>
                        </Link>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={item.selectedColor} size="small" variant="outlined" sx={{ borderColor: isDarkMode ? '#555' : undefined, color: isDarkMode ? '#f5f5f5' : undefined }} />
                          <Chip label={`Size: ${item.selectedSize}`} size="small" variant="outlined" sx={{ borderColor: isDarkMode ? '#555' : undefined, color: isDarkMode ? '#f5f5f5' : undefined }} />
                        </Box>
                      </Box>
                      <IconButton
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        sx={{ color: '#999', '&:hover': { color: '#e91e63' } }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                      {/* Quantity */}
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #e0e0e0',
                        borderRadius: 1
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity, -1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600, color: isDarkMode ? '#f5f5f5' : 'inherit' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity, 1)}
                          disabled={item.quantity >= 10}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Price */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        {item.quantity > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            ${item.price.toFixed(2)} each
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {index < items.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>

          {/* Continue Shopping */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/shop')}
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            Continue Shopping
          </Button>
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 30%' }, maxWidth: { lg: '35%' } }}>
          <Box sx={{ bgcolor: isDarkMode ? '#1e1e1e' : 'white', borderRadius: 2, p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: isDarkMode ? '#f5f5f5' : 'inherit' }}>Order Summary</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal ({totalItems} items)</Typography>
              <Typography fontWeight={600} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>





            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }}>Estimated Total</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }}>${finalTotal.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceedToCheckout}
              sx={{
                py: 2,
                bgcolor: isDarkMode ? '#D4AF37' : '#2C2C2C',
                color: isDarkMode ? '#121212' : 'white',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: isDarkMode ? '#e5c048' : 'black' }
              }}
            >
              PROCEED TO CHECKOUT
            </Button>

            {/* Trust Badges */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
                🔒 Secure checkout powered by Stripe
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">Visa</Typography>
                <Typography variant="caption" color="text.secondary">Mastercard</Typography>
                <Typography variant="caption" color="text.secondary">PayPal</Typography>
                <Typography variant="caption" color="text.secondary">Apple Pay</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart;
