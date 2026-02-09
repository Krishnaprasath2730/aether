import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, InputBase, Badge, Paper, Drawer, List, ListItem, ListItemText, Divider, Collapse } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useScratchCards } from '../../context/ScratchCardContext';
import ThemeToggle from '../Common/ThemeToggle';
import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const { unscratchedCount } = useScratchCards();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'SHOP', path: '/shop' },
    { name: 'WOMEN\'S', path: '/shop?category=Women' },
    { name: 'MEN\'S', path: '/shop?category=Men' },
    { name: 'ACCESSORIES', path: '/shop?category=Accessories' },
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
                  sx={{
                    height: 40,
                    width: 'auto',
                    filter: isDarkMode ? 'brightness(0) saturate(100%) invert(73%) sepia(45%) saturate(450%) hue-rotate(6deg) brightness(95%) contrast(85%)' : 'none'
                  }}
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
                    bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                    boxShadow: 'none',
                    mr: 1
                  }}
                >
                  <InputBase
                    sx={{
                      ml: 2,
                      flex: 1,
                      fontSize: '0.9rem',
                      color: isDarkMode ? '#f5f5f5' : 'inherit',
                      '& ::placeholder': {
                        color: isDarkMode ? '#888' : 'inherit',
                        opacity: 1
                      }
                    }}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <IconButton type="submit" sx={{ p: '10px', color: isDarkMode ? '#f5f5f5' : 'inherit' }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setSearchOpen(false)} sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Collapse>
              {!searchOpen && (
                <IconButton onClick={() => setSearchOpen(true)} sx={{ color: isDarkMode ? '#f5f5f5' : '#2C2C2C' }}>
                  <SearchIcon />
                </IconButton>
              )}
            </Box>

            {/* Mobile Search */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: isDarkMode ? '#f5f5f5' : '#2C2C2C' }}
              onClick={() => navigate('/shop')}
            >
              <SearchIcon />
            </IconButton>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <IconButton
              component={Link}
              to="/wishlist"
              sx={{ color: isDarkMode ? '#f5f5f5' : '#2C2C2C' }}
            >
              <Badge badgeContent={wishlistItems} color="secondary">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>

            {/* Cart */}
            <IconButton component={Link} to="/checkout/cart" sx={{ color: isDarkMode ? '#f5f5f5' : '#2C2C2C' }}>
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

            {/* Wallet */}
            {isAuthenticated && (
              <IconButton
                component={Link}
                to="/wallet"
                sx={{
                  color: '#DAA520',
                  display: { xs: 'none', sm: 'flex' },
                  borderRadius: '50%',
                  p: 1,
                  ml: 1,
                  transition: 'all 0.3s',
                }}
              >
                <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
              </IconButton>
            )}

            {/* Rewards */}
            {isAuthenticated && (
              <IconButton
                component={Link}
                to="/rewards"
                sx={{
                  color: unscratchedCount > 0 ? '#D5A249' : (isDarkMode ? '#f5f5f5' : '#2C2C2C'),
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.3s',
                  animation: unscratchedCount > 0 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' }
                  }
                }}
              >
                <Badge
                  badgeContent={unscratchedCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#e91e63',
                      color: 'white',
                      fontWeight: 700
                    }
                  }}
                >
                  <CardGiftcardIcon sx={{ fontSize: 24 }} />
                </Badge>
              </IconButton>
            )}

            {/* Admin Dashboard */}
            {isAuthenticated && user?.role === 'admin' && (
              <IconButton component={Link} to="/admin" sx={{ color: '#D4AF37', display: { xs: 'none', sm: 'flex' } }}>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>👑</Box>
              </IconButton>
            )}

            {/* Account */}
            <IconButton
              component={Link}
              to="/account"
              sx={{ color: isDarkMode ? '#f5f5f5' : '#2C2C2C', display: { xs: 'none', sm: 'flex' }, p: 0.5 }}
            >
              {isAuthenticated && user?.profilePhoto ? (
                <Box
                  component="img"
                  src={user.profilePhoto}
                  alt={user.name}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #D4AF37'
                  }}
                />
              ) : (
                <PersonOutlineIcon />
              )}
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
            <Box
              component="img"
              src={logo}
              alt="Aether"
              sx={{
                height: 40,
                width: 'auto',
                filter: isDarkMode ? 'brightness(0) saturate(100%) invert(73%) sepia(45%) saturate(450%) hue-rotate(6deg) brightness(95%) contrast(85%)' : 'none'
              }}
            />
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
          {isAuthenticated && (
            <ListItem onClick={() => handleNavClick('/wallet')} sx={{ cursor: 'pointer', borderRadius: 1 }}>
              <ListItemText primary={`Wallet ($${user?.walletBalance?.toFixed(2) || '0.00'})`} />
            </ListItem>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <ListItem onClick={() => handleNavClick('/admin')} sx={{ cursor: 'pointer', borderRadius: 1 }}>
              <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ color: '#D4AF37', fontWeight: 'bold' }} />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
