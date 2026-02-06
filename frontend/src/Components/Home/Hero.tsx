import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: '#f5f5f5', overflow: 'hidden' }}>
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
                  color: 'black', 
                  borderColor: 'black',
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: 'black', color: 'white' }
                }}
              >
                SHOP WOMEN'S
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/shop?category=Men')}
                sx={{ 
                  borderRadius: 0, 
                  color: 'black', 
                  borderColor: 'black',
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: 'black', color: 'white' }
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
