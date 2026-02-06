import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const TopBar: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'black', color: 'white', py: 0.5 }}>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ letterSpacing: 1, fontSize: '0.7rem', fontWeight: 600 }}>
          FINAL CLEARANCE: Take 20% Off "Sale Must-Haves"
        </Typography>
      </Container>
    </Box>
  );
};

export default TopBar;
