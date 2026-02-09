import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Slide data with images and text content
const heroSlides = [
  {
    leftImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
    rightImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    subtitle: 'SUMMER 2024 COLLECTION',
    title: 'FINAL\nCLEARANCE',
    description: 'Take 20% Off "Sale Must-Haves"',
  },
  {
    leftImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop',
    rightImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop',
    subtitle: 'NEW ARRIVALS',
    title: 'SPRING\nESSENTIALS',
    description: 'Discover the Latest Trends',
  },
  {
    leftImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    rightImage: 'https://i.pinimg.com/1200x/91/bb/53/91bb53ac491a324952e9ab3200b70819.jpg',
    subtitle: 'LIMITED EDITION',
    title: 'EXCLUSIVE\nSTYLES',
    description: 'Premium Quality Fashion',
  },
  {
    leftImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop',
    rightImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop',
    subtitle: 'WEEKEND SALE',
    title: 'UP TO\n50% OFF',
    description: 'Don\'t Miss These Deals',
  },
];

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const textVariants = {
  enter: {
    y: 30,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -30,
    opacity: 0,
  },
};

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: isDarkMode ? '#121212' : '#f5f5f5', overflow: 'hidden' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            gap: 4
          }}
        >
          {/* Left Image (Women) */}
          <Box
            sx={{
              flex: 1,
              height: { xs: 400, md: 600 },
              width: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} 
          />

          {/* Center Content */}
          <Box sx={{ flex: 1, textAlign: 'center', px: 2 }}>
            <Typography variant="overline" sx={{ letterSpacing: 2, color: '#666' }}>
              SUMMER 2024 COLLECTION
            </Typography>
            
            <Typography 
              variant="h1" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: { xs: '3rem', lg: '5rem' },
                lineHeight: 1.1,
                mt: 2,
                mb: 1
              }}
            >
              FINAL<br />CLEARANCE
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, letterSpacing: 1, color: '#666' }}>
              Take 20% Off "Sale Must-Haves"
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/shop?category=Women')}
                sx={{
                  borderRadius: 0,
                  color: isDarkMode ? '#D4AF37' : 'black',
                  borderColor: isDarkMode ? '#D4AF37' : 'black',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: isDarkMode ? '#D4AF37' : 'black',
                    color: isDarkMode ? '#121212' : 'white',
                    borderColor: isDarkMode ? '#D4AF37' : 'black'
                  }
                }}
              >
                SHOP WOMEN'S
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/shop?category=Men')}
                sx={{
                  borderRadius: 0,
                  color: isDarkMode ? '#D4AF37' : 'black',
                  borderColor: isDarkMode ? '#D4AF37' : 'black',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: isDarkMode ? '#D4AF37' : 'black',
                    color: isDarkMode ? '#121212' : 'white',
                    borderColor: isDarkMode ? '#D4AF37' : 'black'
                  }
                }}
              >
                SHOP MEN'S
              </Button>
            </Box>

            {/* Dots Indicator */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 6 }}>
              {[0, 1, 2].map(i => (
                <Box 
                  key={i} 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: i === 1 ? 'black' : '#ccc' 
                  }} 
                />
              ))}
            </Box>
          </Box>

          {/* Right Image (Men) */}
          <Box
            sx={{
              flex: 1,
              height: { xs: 400, md: 600 },
              width: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }} 
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;

