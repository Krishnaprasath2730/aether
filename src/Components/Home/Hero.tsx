import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Hero: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          position: 'relative', 
          height: { xs: '100vh', md: '100vh' }, 
          minHeight: 600,
          width: '100%', 
          backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="xl">
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              sx={{ maxWidth: '700px', color: 'white', pl: { md: 4 } }}
            >
              {/* Logo Icon */}
              <Box
                component={motion.img}
                src={logo}
                alt="Aether"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                sx={{ 
                  height: 60, 
                  mb: 3, 
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9
                }}
              />

              {/* Main Title */}
              <Typography 
                component={motion.h1}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                variant="h1" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' }, 
                  lineHeight: 1.05, 
                  mb: 3,
                  fontFamily: '"Playfair Display", serif',
                  letterSpacing: '-1px'
                }}
              >
                Elevate Your
                <Box 
                  component="span" 
                  sx={{ 
                    display: 'block',
                    background: 'linear-gradient(90deg, #D5A249 0%, #F5D79E 50%, #D5A249 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Essence
                </Box>
              </Typography>

              <Typography 
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                variant="h6" 
                sx={{ mb: 5, opacity: 0.9, fontWeight: 300, lineHeight: 1.7, maxWidth: 500 }}
              >
                Discover curated collections of timeless elegance. Premium fashion essentials crafted 
                for those who appreciate the extraordinary.
              </Typography>

              {/* Buttons */}
              <Box 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
              >
                <Button 
                  id="shop-collection-btn"
                  component={Link}
                  to="/shop"
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: '#D5A249', 
                    color: 'black', 
                    borderRadius: 0, 
                    px: 6, 
                    py: 2,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    boxShadow: '0 4px 20px rgba(213, 162, 73, 0.4)',
                    '&:hover': { 
                      bgcolor: '#c49a3e',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 24px rgba(213, 162, 73, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  SHOP COLLECTION
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    borderRadius: 0, 
                    px: 4, 
                    py: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    '&:hover': { 
                      borderColor: '#D5A249', 
                      color: '#D5A249',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  OUR STORY
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Scroll Indicator */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          sx={{ 
            position: 'absolute', 
            bottom: 40, 
            left: '50%', 
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>
            SCROLL
          </Typography>
          <Box 
            component={motion.div}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            sx={{ 
              width: 1, 
              height: 40, 
              bgcolor: 'rgba(255,255,255,0.3)' 
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
