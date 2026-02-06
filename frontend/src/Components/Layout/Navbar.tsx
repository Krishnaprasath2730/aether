import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, InputBase, Badge, Paper, Drawer, List, ListItem, ListItemText, Divider, Collapse } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'SHOP', path: '/shop' },
    { name: 'WOMEN\'S', path: '/shop?category=Women' },
    { name: 'MEN\'S', path: '/shop?category=Men' },
    { name: 'ACCESSORIES', path: '/shop?category=Accessories' },
    { name: 'PAGES', path: '/pages' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
          
          {/* Left: Mobile Menu & Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              sx={{ display: { md: 'none' } }} 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="Aether Logo"
                  sx={{ height: 40, width: 'auto' }}
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    letterSpacing: '2px',
                    fontFamily: '"Playfair Display", serif',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  AETHER
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Center: Navigation Links (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {categories.map((cat) => (
              <Typography 
                key={cat.name}
                variant="subtitle2"
                sx={{ 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  opacity: 0.8,
                  letterSpacing: '1px',
                  position: 'relative',
                  '&:hover': { opacity: 1 },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: 0,
                    height: 2,
                    bgcolor: '#D5A249',
                    transition: 'width 0.3s'
                  },
                  '&:hover::after': { width: '100%' }
                }}
                onClick={() => handleNavClick(cat.path)}
              >
                {cat.name}
              </Typography>
            ))}
          </Box>

          {/* Right: Search & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Collapse in={searchOpen} orientation="horizontal">
                <Paper
                  component="form"
                  onSubmit={handleSearch}
                  sx={{ 
                    p: '2px 4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: 250, 
                    borderRadius: 20, 
                    bgcolor: '#f5f5f5', 
                    boxShadow: 'none',
                    mr: 1
                  }}
                >
                  <InputBase
                    sx={{ ml: 2, flex: 1, fontSize: '0.9rem' }}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setSearchOpen(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Collapse>
              {!searchOpen && (
                <IconButton onClick={() => setSearchOpen(true)} sx={{ color: '#2C2C2C' }}>
                  <SearchIcon />
                </IconButton>
              )}
            </Box>

            {/* Mobile Search */}
            <IconButton 
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#2C2C2C' }}
              onClick={() => navigate('/shop')}
            >
              <SearchIcon />
            </IconButton>

            {/* Wishlist */}
            <IconButton 
              component={Link} 
              to="/wishlist" 
              sx={{ color: '#2C2C2C' }}
            >
              <Badge badgeContent={wishlistItems} color="secondary">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
            
            {/* Cart */}
            <IconButton component={Link} to="/checkout/cart" sx={{ color: '#2C2C2C' }}>
              <Badge 
                badgeContent={totalItems} 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#D5A249', 
                    color: 'black',
                    fontWeight: 700 
                  } 
                }}
              >
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Account */}
            <IconButton 
              component={Link} 
              to="/account" 
              sx={{ color: '#2C2C2C', display: { xs: 'none', sm: 'flex' } }}
            >
              <PersonOutlineIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 300 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={logo} alt="Aether" sx={{ height: 30 }} />
            <Typography variant="h6" fontWeight={800}>AETHER</Typography>
          </Box>
          <IconButton onClick={() => setIsMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Mobile Search */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Paper
            component="form"
            onSubmit={(e) => {
              handleSearch(e);
              setIsMobileMenuOpen(false);
            }}
            sx={{ 
              p: '2px 8px', 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: '#f5f5f5', 
              boxShadow: 'none',
              borderRadius: 1
            }}
          >
            <InputBase
              sx={{ flex: 1, fontSize: '0.9rem' }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" size="small">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        
        <Divider />
        
        <List sx={{ px: 1 }}>
          <ListItem 
            onClick={() => handleNavClick('/shop')}
            sx={{ cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            <ListItemText 
              primary="SHOP ALL" 
              primaryTypographyProps={{ fontWeight: 700, letterSpacing: '1px' }} 
            />
          </ListItem>
          {categories.map((cat) => (
            <ListItem 
              key={cat.name} 
              onClick={() => handleNavClick(cat.path)}
              sx={{ cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              <ListItemText 
                primary={cat.name} 
                primaryTypographyProps={{ fontWeight: 600, letterSpacing: '1px' }} 
              />
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <List sx={{ px: 1 }}>
          <ListItem onClick={() => handleNavClick('/checkout/cart')} sx={{ cursor: 'pointer', borderRadius: 1 }}>
            <ListItemText primary="Shopping Bag" />
            {totalItems > 0 && (
              <Badge badgeContent={totalItems} sx={{ '& .MuiBadge-badge': { bgcolor: '#D5A249', color: 'black' } }} />
            )}
          </ListItem>
          <ListItem onClick={() => handleNavClick('/wishlist')} sx={{ cursor: 'pointer', borderRadius: 1 }}>
            <ListItemText primary="Wishlist" />
            {wishlistItems > 0 && (
              <Badge badgeContent={wishlistItems} color="secondary" />
            )}
          </ListItem>
          <ListItem onClick={() => handleNavClick('/account')} sx={{ cursor: 'pointer', borderRadius: 1 }}>
            <ListItemText primary="My Account" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
