import React from 'react';
import { Box, Container } from '@mui/material';

// Placeholder logos (using text or simple shapes in a real app, usually images)
const brands = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png'
];

const Brands: React.FC = () => {
  return (
    <Box sx={{ py: 6, borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 4,
            opacity: 0.6
          }}
        >
          {brands.map((logo, index) => (
            <Box 
              key={index} 
              component="img" 
              src={logo} 
              sx={{ height: 40, objectFit: 'contain', filter: 'grayscale(100%)' }} 
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Brands;
