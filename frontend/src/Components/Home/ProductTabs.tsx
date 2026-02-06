import React, { useState } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import ProductCard from '../Product/ProductCard';
import { products } from '../../data/products';

const ProductTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getProducts = () => {
    switch(value) {
      case 0: return products.slice(0, 4); // New
      case 1: return products.slice(4, 8); // Special
      case 2: return products.slice(2, 6); // Featured
      default: return products.slice(0, 4);
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            centered
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .Mui-selected': { color: 'black !important', fontWeight: 700 }
            }}
          >
            <Tab label="New Products" sx={{ textTransform: 'none', color: '#999', fontSize: '1rem' }} />
            <Tab label="Special Products" sx={{ textTransform: 'none', color: '#999', fontSize: '1rem', px: 4 }} />
            <Tab label="Featured Products" sx={{ textTransform: 'none', color: '#999', fontSize: '1rem' }} />
          </Tabs>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {getProducts().map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductTabs;
