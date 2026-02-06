import React, { useState, useMemo, useEffect } from 'react';
import { Box, Container, Typography, Chip, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Slider, Drawer, IconButton, Button, Pagination } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import ProductCard from '../Product/ProductCard';
import { products, categories } from '../../data/products';

const PRODUCTS_PER_PAGE = 12;

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL params
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, priceRange]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.colors.some(c => c.toLowerCase().includes(query))
      );
    }
    
    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured - keep original order
        break;
    }
    
    return result;
  }, [selectedCategory, searchQuery, sortBy, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([0, 500]);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery || priceRange[0] > 0 || priceRange[1] < 500;

  const FilterContent = () => (
    <Box sx={{ p: { xs: 3, md: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>Filters</Typography>
        {hasActiveFilters && (
          <Button size="small" onClick={handleClearFilters} sx={{ color: '#D5A249' }}>
            Clear All
          </Button>
        )}
      </Box>
      
      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(_, value) => setPriceRange(value as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          sx={{ 
            color: '#D5A249',
            '& .MuiSlider-thumb': { bgcolor: '#D5A249' },
            '& .MuiSlider-track': { bgcolor: '#D5A249' }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" fontWeight={600}>${priceRange[0]}</Typography>
          <Typography variant="caption" fontWeight={600}>${priceRange[1]}</Typography>
        </Box>
      </Box>
      
      {/* Categories */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Categories</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {categories.map(cat => (
            <Box 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              sx={{ 
                py: 1.5, 
                px: 2, 
                cursor: 'pointer', 
                borderRadius: 1,
                bgcolor: selectedCategory === cat ? '#2C2C2C' : 'transparent',
                color: selectedCategory === cat ? 'white' : 'text.primary',
                transition: 'all 0.2s',
                fontWeight: selectedCategory === cat ? 600 : 400,
                '&:hover': { bgcolor: selectedCategory === cat ? '#2C2C2C' : '#f5f5f5' }
              }}
            >
              <Typography variant="body2">{cat}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Hero Banner */}
      <Box sx={{ bgcolor: '#2C2C2C', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#D5A249', letterSpacing: 3 }}>THE COLLECTION</Typography>
          <Typography variant="h2" fontWeight={800} sx={{ mt: 1, fontFamily: '"Playfair Display", serif' }}>
            {selectedCategory === 'All' ? 'Shop All' : selectedCategory}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mt: 2 }}>
            Discover our curated selection of premium essentials
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          {/* Category Chips (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => handleCategoryChange(cat)}
                sx={{
                  bgcolor: selectedCategory === cat ? '#2C2C2C' : 'white',
                  color: selectedCategory === cat ? 'white' : 'text.primary',
                  fontWeight: 600,
                  '&:hover': { bgcolor: selectedCategory === cat ? '#2C2C2C' : '#f0f0f0' }
                }}
              />
            ))}
          </Box>
          
          {/* Mobile Filter Button */}
          <Button 
            startIcon={<TuneIcon />} 
            onClick={() => setMobileFiltersOpen(true)}
            variant="outlined"
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#2C2C2C', borderColor: '#2C2C2C' }}
          >
            Filters {hasActiveFilters && `(${selectedCategory !== 'All' ? 1 : 0})`}
          </Button>

          {/* Search & Sort */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }}
              sx={{ width: { xs: '100%', sm: 220 }, bgcolor: 'white' }}
            />
            <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'white' }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="name">Name: A-Z</MenuItem>
                <MenuItem value="name-desc">Name: Z-A</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Sidebar Filters (Desktop) */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: 280 }, 
              flexShrink: 0,
              display: { xs: 'none', md: 'block' } 
            }}
          >
            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
              <FilterContent />
            </Box>
          </Box>

          {/* Product Grid */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </Typography>
              {hasActiveFilters && (
                <Button size="small" onClick={handleClearFilters} startIcon={<CloseIcon />} sx={{ display: { md: 'none' } }}>
                  Clear Filters
                </Button>
              )}
            </Box>
            
            {paginatedProducts.length > 0 ? (
              <>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3 
                  }}
                >
                  {paginatedProducts.map(product => (
                    <Box 
                      key={product.id}
                      sx={{ 
                        flex: { xs: '1 1 45%', sm: '1 1 30%', lg: '1 1 22%' },
                        maxWidth: { xs: '48%', sm: '32%', lg: '24%' }
                      }}
                    >
                      <ProductCard {...product} />
                    </Box>
                  ))}
                </Box>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination 
                      count={totalPages} 
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="standard"
                      sx={{
                        '& .Mui-selected': { bgcolor: '#2C2C2C !important', color: 'white' }
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 2 }}>
                <FilterListIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} color="text.secondary">No products found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                  Try adjusting your filters or search terms
                </Typography>
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 300 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setMobileFiltersOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <FilterContent />
      </Drawer>
    </Box>
  );
};

export default Shop;
