import React from 'react';
import { Box, Container, Typography, Grid, Stack, IconButton, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#0a0a0a', color: 'white', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Decorative Border */}
      <Box sx={{ height: 1, background: 'linear-gradient(90deg, transparent, #D5A249, transparent)' }} />

      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                component="img"
                src={logo}
                alt="Aether"
                sx={{ height: 50, filter: 'brightness(0) invert(1)' }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 3, fontFamily: '"Playfair Display", serif' }}>
                AETHER
              </Typography>
            </Box>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, mb: 4, maxWidth: 320 }}>
              Where craftsmanship meets contemporary design. We curate timeless pieces for the modern individual who values quality and sophistication.
            </Typography>

            {/* Social Links */}
            <Stack direction="row" spacing={1.5}>
              {[
                { icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
                { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                { icon: <FacebookIcon fontSize="small" />, label: 'Facebook' },
                { icon: <YouTubeIcon fontSize="small" />, label: 'YouTube' }
              ].map((social) => (
                <IconButton 
                  key={social.label}
                  sx={{ 
                    width: 44,
                    height: 44,
                    color: 'rgba(255,255,255,0.5)', 
                    border: '1px solid rgba(255,255,255,0.15)',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      borderColor: '#D5A249', 
                      color: '#D5A249',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography sx={{ fontWeight: 600, mb: 3, letterSpacing: 2, fontSize: '0.8rem', color: '#D5A249' }}>
              SHOP
            </Typography>
            <Stack spacing={2}>
              {['New Arrivals', 'Best Sellers', 'Men', 'Women', 'Accessories'].map((link) => (
                <Link key={link} to="/shop" style={{ textDecoration: 'none' }}>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      fontSize: '0.9rem',
                      transition: 'all 0.3s',
                      '&:hover': { color: 'white', pl: 1 }
                    }}
                  >
                    {link}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Help Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography sx={{ fontWeight: 600, mb: 3, letterSpacing: 2, fontSize: '0.8rem', color: '#D5A249' }}>
              HELP
            </Typography>
            <Stack spacing={2}>
              {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Size Guide'].map((link) => (
                <Typography 
                  key={link}
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { color: 'white', pl: 1 }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ fontWeight: 600, mb: 3, letterSpacing: 2, fontSize: '0.8rem', color: '#D5A249' }}>
              STAY CONNECTED
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, lineHeight: 1.7 }}>
              Subscribe to receive exclusive offers, early access to new arrivals, and style inspiration.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 0 }}>
              <TextField
                placeholder="Your email address"
                variant="outlined"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: 0,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#D5A249' }
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: 'rgba(255,255,255,0.4)',
                    opacity: 1
                  }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#D5A249',
                  color: '#0a0a0a',
                  borderRadius: 0,
                  px: 3,
                  minWidth: 'auto',
                  '&:hover': { bgcolor: 'white' }
                }}
              >
                <ArrowForwardIcon />
              </Button>
            </Box>

            {/* Trust Badges */}
            <Box sx={{ display: 'flex', gap: 4, mt: 5, flexWrap: 'wrap' }}>
              {['Free Shipping', 'Secure Payment', 'Easy Returns'].map((badge) => (
                <Box key={badge} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, bgcolor: '#D5A249', borderRadius: '50%' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
                    {badge}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              py: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              © 2024 AETHER. All rights reserved.
            </Typography>

            {/* Payment Methods */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                <Box
                  key={method}
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: 1
                  }}
                >
                  {method.toUpperCase()}
                </Box>
              ))}
            </Box>

            {/* Legal Links */}
            <Stack direction="row" spacing={4}>
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <Typography 
                  key={link}
                  sx={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#D5A249' }
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Large Background Text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: { xs: '4rem', md: '10rem' },
          fontWeight: 900,
          color: 'rgba(255,255,255,0.02)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: '"Playfair Display", serif',
          letterSpacing: 20
        }}
      >
        AETHER
      </Typography>
    </Box>
  );
};

export default Footer;
