import React from 'react';
import { Box } from '@mui/material';
import Hero from '../Home/Hero';
import Categories from '../Home/Categories';
import ProductTabs from '../Home/ProductTabs';
import SplitBanner from '../Home/SplitBanner';
import Brands from '../Home/Brands';
import BlogSection from '../Home/BlogSection';
import InstagramFeed from '../Home/InstagramFeed';
import Newsletter from '../Home/Newsletter';

const Home: React.FC = () => {
  return (
    <Box>
      <Hero />
      <Categories />
      <ProductTabs />
      <SplitBanner />
      <ProductTabs /> {/* Reuse for "Trending Now" section layout */}
      <Brands />
      <BlogSection />
      <InstagramFeed />
      <Newsletter />
    </Box>
  );
};

export default Home;
