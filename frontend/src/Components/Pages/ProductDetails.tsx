import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip, IconButton, Breadcrumbs, Snackbar, Alert, Skeleton, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getProductById, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAutoPurchase } from '../../context/AutoPurchaseContext';
import ProductCard from '../Product/ProductCard';
import AutoPurchaseDialog from '../Features/AutoPurchaseDialog';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(getProductById(id || ''));
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPurchaseDialogOpen, setAutoPurchaseDialogOpen] = useState(false);
  const { isMonitoring } = useAutoPurchase();

  // Simulate loading and fetch product
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundProduct = getProductById(id || '');
      setProduct(foundProduct);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setIsLoading(false);
      
      // Scroll to top when product changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Get related products (same category, excluding current)
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' } }}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' } }}>
            <Skeleton variant="text" width={100} height={30} />
            <Skeleton variant="text" width="80%" height={60} />
            <Skeleton variant="text" width={150} height={50} />
            <Skeleton variant="text" width="100%" height={100} sx={{ mt: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Product Not Found</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The product you're looking for doesn't exist or has been removed.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/shop')} sx={{ bgcolor: '#2C2C2C' }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const alreadyInCart = selectedSize && selectedColor ? isInCart(product.id, selectedSize, selectedColor) : false;

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showSnackbar('Please select a size', 'warning');
      return;
    }
    if (!selectedColor) {
      showSnackbar('Please select a color', 'warning');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    showSnackbar(`${product.name} added to your bag!`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showSnackbar('Please select a size', 'warning');
      return;
    }
    if (!selectedColor) {
      showSnackbar('Please select a color', 'warning');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout/cart');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      showSnackbar('Removed from wishlist');
    } else {
      addToWishlist(product);
      showSnackbar('Added to wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      showSnackbar('Link copied to clipboard!');
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
          <Link to={`/shop?category=${product.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.category}</Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {/* Product Image */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' }, maxWidth: { md: '50%' } }}>
            <Box 
              sx={{ 
                position: 'relative',
                bgcolor: '#f8f8f8',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '1/1'
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Action Buttons */}
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <IconButton 
                  onClick={handleWishlistToggle}
                  sx={{ 
                    bgcolor: 'white',
                    color: inWishlist ? '#e91e63' : 'inherit',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  {inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleShare} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}>
                  <ShareOutlinedIcon />
                </IconButton>
              </Box>

              {/* Stock Badge */}
              {!product.inStock && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16, 
                  bgcolor: '#f44336',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}>
                  Out of Stock
                </Box>
              )}
            </Box>
          </Box>

          {/* Product Info */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' }, maxWidth: { md: '50%' } }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                {product.category}
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
                {product.name}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#D5A249', mb: 1, fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2.125rem' } }}>
                ₹{product.price.toLocaleString('en-IN')}
              </Typography>

              {/* Last Offered Price */}
              {product.lastOfferedPrice && product.lastOfferedPrice < product.price && (
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 3,
                  px: 2,
                  py: 0.75,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 2,
                  border: '1px dashed rgba(76, 175, 80, 0.4)'
                }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    🏷️ Last Offered:
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#4CAF50' }}>
                    ₹{product.lastOfferedPrice.toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    bgcolor: '#4CAF50', 
                    color: 'white', 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: 1,
                    fontWeight: 600
                  }}>
                    Save {Math.round(((product.price - product.lastOfferedPrice) / product.price) * 100)}%
                  </Typography>
                </Box>
              )}

              {!product.lastOfferedPrice && <Box sx={{ mb: 3 }} />}

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                {product.description}
              </Typography>

              {/* Color Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                  Color: {selectedColor && <Box component="span" sx={{ fontWeight: 400, color: '#D5A249' }}>{selectedColor}</Box>}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.colors.map(color => (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => setSelectedColor(color)}
                      icon={selectedColor === color ? <CheckCircleOutlineIcon /> : undefined}
                      sx={{
                        bgcolor: selectedColor === color ? '#2C2C2C' : 'white',
                        color: selectedColor === color ? 'white' : 'text.primary',
                        border: '1px solid',
                        borderColor: selectedColor === color ? '#2C2C2C' : '#e0e0e0',
                        fontWeight: 500,
                        '&:hover': { bgcolor: selectedColor === color ? '#2C2C2C' : '#f5f5f5' }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Size: {selectedSize && <Box component="span" sx={{ fontWeight: 400, color: '#D5A249' }}>{selectedSize}</Box>}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#D5A249', cursor: 'pointer', textDecoration: 'underline' }}>
                    Size Guide
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <Box
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        minWidth: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: selectedSize === size ? '2px solid #2C2C2C' : '1px solid #e0e0e0',
                        borderRadius: 1,
                        cursor: 'pointer',
                        fontWeight: selectedSize === size ? 700 : 500,
                        bgcolor: selectedSize === size ? '#fafafa' : 'white',
                        px: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#2C2C2C' }
                      }}
                    >
                      {size}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Quantity */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Quantity</Typography>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1 
                }}>
                  <IconButton 
                    onClick={() => handleQuantityChange(-1)} 
                    disabled={quantity <= 1}
                    sx={{ borderRadius: 0 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography fontWeight={600} sx={{ minWidth: 50, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => handleQuantityChange(1)} 
                    disabled={quantity >= 10}
                    sx={{ borderRadius: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {quantity >= 10 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    Maximum 10 per order
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  sx={{ 
                    py: 2, 
                    bgcolor: alreadyInCart ? '#4caf50' : '#2C2C2C', 
                    fontWeight: 700,
                    '&:hover': { bgcolor: alreadyInCart ? '#43a047' : 'black' }
                  }}
                >
                  {alreadyInCart ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  sx={{ 
                    py: 2, 
                    borderColor: '#D5A249',
                    color: '#D5A249',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#D5A249', color: 'white', borderColor: '#D5A249' }
                  }}
                >
                  BUY NOW
                </Button>
              </Box>

              {/* Auto Purchase Button */}
              <Box sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setAutoPurchaseDialogOpen(true)}
                  disabled={!product.inStock || isMonitoring(product.id)}
                  startIcon={<TrendingDownIcon />}
                  sx={{ 
                    py: 2, 
                    bgcolor: isMonitoring(product.id) ? '#4caf50' : '#000',
                    color: '#fff',
                    fontWeight: 700,
                    border: '2px solid #D5A249',
                    '&:hover': { bgcolor: isMonitoring(product.id) ? '#45a049' : '#222' },
                    '&:disabled': { bgcolor: '#ccc', borderColor: '#ccc' }
                  }}
                >
                  {isMonitoring(product.id) ? '🎯 AUTO-PURCHASE ACTIVE' : '🎯 SET AUTO-PURCHASE'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Set a target price and we'll auto-buy when the price drops!
                </Typography>
              </Box>

              {/* Features */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 4, borderTop: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShippingOutlinedIcon sx={{ color: '#D5A249' }} />
                  <Typography variant="body2">Free shipping on orders over ₹20,000</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CachedIcon sx={{ color: '#D5A249' }} />
                  <Typography variant="body2">30-day easy returns</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShieldOutlinedIcon sx={{ color: '#D5A249' }} />
                  <Typography variant="body2">2-year quality guarantee</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 8, borderTop: '1px solid #eee', pt: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, v) => setActiveTab(v)}
            sx={{ 
              mb: 4,
              '& .MuiTabs-scroller': { overflow: { xs: 'auto !important', md: 'hidden !important' } },
              '& .Mui-selected': { color: '#2C2C2C !important' },
              '& .MuiTabs-indicator': { bgcolor: '#D5A249' }
            }}
          >
            <Tab label="Description" sx={{ fontWeight: 600 }} />
            <Tab label="Details & Care" sx={{ fontWeight: 600 }} />
            <Tab label="Shipping" sx={{ fontWeight: 600 }} />
          </Tabs>
          
          {activeTab === 0 && (
            <Typography variant="body1" sx={{ maxWidth: 800, lineHeight: 1.8 }}>
              {product.description}
            </Typography>
          )}
          {activeTab === 1 && (
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>• Premium quality materials</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>• Ethically sourced and manufactured</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>• Machine wash cold, tumble dry low</Typography>
              <Typography variant="body1">• Do not bleach or iron directly on prints</Typography>
            </Box>
          )}
          {activeTab === 2 && (
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>• Standard delivery: 5-7 business days</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>• Express delivery: 2-3 business days (+₹1,500)</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>• Overnight delivery: Next business day (+₹3,000)</Typography>
              <Typography variant="body1">• Free shipping on all orders over ₹20,000</Typography>
            </Box>
          )}
        </Box>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>You May Also Like</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {relatedProducts.map(p => (
                <Box 
                  key={p.id}
                  sx={{ 
                    flex: { xs: '0 0 calc(50% - 12px)', sm: '1 1 30%', md: '1 1 22%' },
                    maxWidth: { xs: 'calc(50% - 12px)', sm: '32%', md: '24%' }
                  }}
                >
                  <ProductCard {...p} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
          action={
            snackbarSeverity === 'success' && snackbarMessage.includes('bag') ? (
              <Button color="inherit" size="small" onClick={() => navigate('/checkout/cart')}>
                View Bag
              </Button>
            ) : undefined
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Auto Purchase Dialog */}
      <AutoPurchaseDialog
        open={autoPurchaseDialogOpen}
        onClose={() => setAutoPurchaseDialogOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          sizes: product.sizes,
          colors: product.colors
        }}
      />
    </Box>
  );
};

export default ProductDetails;
