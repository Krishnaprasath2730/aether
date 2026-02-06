import React from 'react';
import { Box, Container, Typography, Stack, IconButton, TextField, Button } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'white', color: 'black', pt: 8, pb: 4, borderTop: '1px solid #eee' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Newsletter (Left/Top) */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 35%' }, mb: { xs: 4, md: 0 } }}>
             <Box component="img" src={logo} alt="Aether" sx={{ height: 30, mb: 2 }} />
             <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem', letterSpacing: 1 }}>NEWSLETTER SUBSCRIPTION</Typography>
             <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.8rem' }}>
               Sign up for Aether updates to receive information about new arrivals, future events and specials.
             </Typography>
             <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd', pb: 0.5 }}>
               <TextField 
                 placeholder="Enter your email address" 
                 variant="standard" 
                 InputProps={{ disableUnderline: true }}
                 sx={{ flex: 1, '& input': { fontSize: '0.9rem' } }}
               />
               <Button sx={{ minWidth: 'auto', color: 'black', fontWeight: 600 }}>SUBSCRIBE</Button>
             </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Links Columns */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, flex: { xs: '1 1 100%', md: '0 0 60%' }, justifyContent: 'space-between' }}>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '0.85rem' }}>SHOP</Typography>
              <Stack spacing={1}>
                {['New Arrivals', 'Men', 'Women', 'Accessories', 'Sale'].map(item => (
                  <Typography key={item} variant="body2" sx={{ color: '#666', cursor: 'pointer', fontSize: '0.8rem', '&:hover': { color: 'black' } }}>{item}</Typography>
                ))}
              </Stack>
            </Box>

            <Box sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '0.85rem' }}>INFORMATION</Typography>
              <Stack spacing={1}>
                {['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'Blog'].map(item => (
                  <Typography key={item} variant="body2" sx={{ color: '#666', cursor: 'pointer', fontSize: '0.8rem', '&:hover': { color: 'black' } }}>{item}</Typography>
                ))}
              </Stack>
            </Box>

             <Box sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '0.85rem' }}>CUSTOMER SERVICE</Typography>
              <Stack spacing={1}>
                {['Search Terms', 'Advanced Search', 'Orders and Returns', 'Contact Us', 'Theme FAQs'].map(item => (
                  <Typography key={item} variant="body2" sx={{ color: '#666', cursor: 'pointer', fontSize: '0.8rem', '&:hover': { color: 'black' } }}>{item}</Typography>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Socials & Bottom */}
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #eee', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#999' }}>© 2024 Aether. All layout rights reserved.</Typography>
          
          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: '#999', '&:hover': { color: 'black' } }}><FacebookIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: '#999', '&:hover': { color: 'black' } }}><TwitterIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: '#999', '&:hover': { color: 'black' } }}><InstagramIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: '#999', '&:hover': { color: 'black' } }}><YouTubeIcon fontSize="small" /></IconButton>
          </Stack>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
             {/* Simple payment boxes placeholder */}
             {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(p => (
               <Box key={p} sx={{ bgcolor: '#eee', px: 1, py: 0.5, fontSize: '0.6rem', fontWeight: 700, color: '#666', borderRadius: 0.5 }}>
                 {p}
               </Box>
             ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
