import React from 'react';
import { Box } from '@mui/material';
import Hero from '../Home/Hero';
import Categories from '../Home/Categories';
import FeaturedProducts from '../Home/FeaturedProducts';
import Features from '../Home/Features';
import Newsletter from '../Home/Newsletter';

const Home: React.FC = () => {
  return (
    <Box>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </Box>
  );
};

export default Home;
