import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <FavoriteIcon sx={{ fontSize: 100, color: '#e0e0e0', mb: 3 }} />
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Your wishlist is empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Save your favorite items here for later
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

  const handleQuickAdd = (product: typeof items[0]) => {
    // Add with first available size and color
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight={800}>My Wishlist</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </Typography>
        </Box>
        <Button 
          variant="text" 
          onClick={clearWishlist} 
          sx={{ color: 'text.secondary', '&:hover': { color: '#e91e63' } }}
        >
          Clear All
        </Button>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3 
        }}
      >
        {items.map(item => (
          <Box 
            key={item.id}
            sx={{ 
              flex: { xs: '1 1 45%', sm: '1 1 30%', md: '1 1 22%' },
              maxWidth: { xs: '48%', sm: '32%', md: '24%' },
              position: 'relative' 
            }}
          >
            {/* Image */}
            <Link to={`/product/${item.id}`}>
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{ 
                  width: '100%', 
                  aspectRatio: '3/4', 
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              />
            </Link>

            {/* Remove Button */}
            <IconButton
              onClick={() => removeFromWishlist(item.id)}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                bgcolor: 'white',
                '&:hover': { bgcolor: '#ffebee', color: '#e91e63' }
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>

            {/* Details */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.category}
              </Typography>
              <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ '&:hover': { color: '#D5A249' } }}>
                  {item.name}
                </Typography>
              </Link>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                ${item.price.toFixed(2)}
              </Typography>

              {/* Quick Add Button */}
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={() => handleQuickAdd(item)}
                sx={{ 
                  mt: 2, 
                  borderColor: '#2C2C2C', 
                  color: '#2C2C2C',
                  '&:hover': { bgcolor: '#2C2C2C', color: 'white' }
                }}
              >
                Quick Add
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/shop')}
        sx={{ mt: 4, color: 'text.secondary' }}
      >
        Continue Shopping
      </Button>
    </Container>
  );
};

export default Wishlist;
