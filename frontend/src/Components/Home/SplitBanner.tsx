import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const SplitBanner: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Left Banner */}
          <Box 
            sx={{ 
              flex: 1, 
              height: 400, 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              px: { xs: 4, md: 8 },
              backgroundImage: 'url(https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'right center'
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>NEW ARRIVALS</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 3, maxWidth: 300 }}>
                TOUCH OF<br />COLOR
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: 'black', 
                  color: 'white', 
                  borderRadius: 0, 
                  px: 4,
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                DISCOVER MORE
              </Button>
            </Box>
          </Box>

          {/* Right Banner */}
          <Box 
            sx={{ 
              flex: 1, 
              height: 400, 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              textAlign: 'right',
              px: { xs: 4, md: 8 },
              backgroundImage: 'url(https://images.unsplash.com/photo-1551488852-d8042973789b?q=80&w=1000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>NEW FOR AUTUMN</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 3, maxWidth: 400 }}>
                THIS SEASON'S<br />BOMBER JACKETS
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: 'black', 
                  color: 'white', 
                  borderRadius: 0, 
                  px: 4,
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                DISCOVER MORE
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SplitBanner;
