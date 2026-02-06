import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Grid, Divider, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  // Calculate shipping
  const FREE_SHIPPING_THRESHOLD = 200;
  const STANDARD_SHIPPING = 15;
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;
  const finalTotal = totalPrice + shippingCost;

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

      {/* Free Shipping Progress */}
      {shippingCost > 0 && (
        <Box sx={{ mb: 4, p: 3, bgcolor: '#fffde7', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalShippingOutlinedIcon sx={{ color: '#D5A249' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Add ${amountToFreeShipping.toFixed(2)} more for FREE shipping!
            </Typography>
            <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, height: 6, mt: 1 }}>
              <Box sx={{ 
                width: `${Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)}%`, 
                bgcolor: '#D5A249', 
                borderRadius: 1, 
                height: '100%',
                transition: 'width 0.3s'
              }} />
            </Box>
          </Box>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
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
                          <Typography variant="h6" fontWeight={700} sx={{ '&:hover': { color: '#D5A249' } }}>
                            {item.name}
                          </Typography>
                        </Link>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={item.selectedColor} size="small" variant="outlined" />
                          <Chip label={`Size: ${item.selectedSize}`} size="small" variant="outlined" />
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
                        border: '1px solid #e0e0e0', 
                        borderRadius: 1 
                      }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity, -1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
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
                        <Typography variant="h6" fontWeight={700}>
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
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Order Summary</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal ({totalItems} items)</Typography>
              <Typography fontWeight={600}>${totalPrice.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Estimated Shipping</Typography>
              <Typography fontWeight={600} sx={{ color: shippingCost === 0 ? '#4caf50' : 'inherit' }}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h6" fontWeight={700}>Estimated Total</Typography>
              <Typography variant="h6" fontWeight={700}>${finalTotal.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/checkout/shipping')}
              sx={{ 
                py: 2, 
                bgcolor: '#2C2C2C', 
                fontWeight: 700, 
                fontSize: '1rem',
                '&:hover': { bgcolor: 'black' } 
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
