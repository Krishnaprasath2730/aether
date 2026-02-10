import React, { useState, useMemo, useEffect } from 'react';
import { Box, Container, Typography, Chip, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Slider, Drawer, IconButton, Button, Pagination, InputBase } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ProductCard from '../Product/ProductCard';
import { products, categories, getRefurbishedProducts } from '../../data/products';
import { useTheme } from '../../context/ThemeContext';

const PRODUCTS_PER_PAGE = 12;

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDarkMode } = useTheme();

  // Get initial values from URL params
  const initialCategory = searchParams.get('category') || 'All';
  const initialSubCategory = searchParams.get('sub');
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [localPriceRange, setLocalPriceRange] = useState<number[]>([0, 50000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedSubCategory) params.set('sub', selectedSubCategory); // Sync sub-category
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedSubCategory, searchQuery, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy, priceRange]);

  // Sync local slider state when filters are cleared or changed externally
  useEffect(() => {
        setLocalPriceRange(priceRange);
  }, [priceRange]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory === 'Hub') {
      result = result.filter(p => p.isRefurbished);
    } else if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by sub-category
    if (selectedSubCategory) {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(query)) || // Include subCategory in search
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

  const hubFeaturedProducts = useMemo(() => {
    if (selectedCategory === 'Hub') {
      // Just take the first 5-6 as "Featured" for the horizontal scroll
      return getRefurbishedProducts().slice(0, 6);
    }
    return [];
  }, [selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Clear sub-category when changing main category
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory(null);
    setSearchQuery('');
    setPriceRange([0, 50000]);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedSubCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 50000;

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
      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 3, letterSpacing: 0.5 }}>PRICE RANGE</Typography>
        
        <Box sx={{ px: 1 }}>
            <Slider
              value={localPriceRange}
              onChange={(_, value) => setLocalPriceRange(value as number[])}
              onChangeCommitted={(_, value) => setPriceRange(value as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={50000}
              disableSwap
              sx={{
                color: isDarkMode ? '#D5A249' : '#2C2C2C',
                height: 3,
                padding: '13px 0',
                '& .MuiSlider-thumb': {
                  height: 20,
                  width: 20,
                  backgroundColor: isDarkMode ? '#D5A249' : '#2C2C2C',
                  border: 'none',
                  boxShadow: 'none',
                  transition: '0.2s ease',
                  // Ensure we don't animate 'left' or 'transform' which interferes with dragging
                  transitionProperty: 'width, height, box-shadow, background-color',
                  '&:before': { 
                      display: 'none' 
                  },
                  '&:hover, &.Mui-active': {
                    boxShadow: '0 0 0 8px rgba(213, 162, 73, 0.1)',
                    width: 24,
                    height: 24,
                  },
                },
                '& .MuiSlider-valueLabel': {
                  lineHeight: 1.2,
                  fontSize: 12,
                  background: 'unset',
                  padding: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50% 50% 50% 0',
                  backgroundColor: isDarkMode ? '#D5A249' : '#2C2C2C',
                  transformOrigin: 'bottom left',
                  transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                  '&:before': { display: 'none' },
                  '&.MuiSlider-valueLabelOpen': {
                    transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                  },
                  '& > *': {
                    transform: 'rotate(45deg)',
                  },
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  height: 3,
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  backgroundColor: 'text.secondary',
                  height: 3,
                },
              }}
            />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box sx={{ 
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee', 
                borderRadius: 2, 
                px: 2, 
                py: 1,
                minWidth: 80
            }}>
                 <Typography variant="caption" color="text.secondary" display="block">Min</Typography>
                 <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight={600} mr={0.5}>₹</Typography>
                    <InputBase
                        value={localPriceRange[0]}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (!isNaN(val) && val >= 0 && val <= 50000) {
                                setLocalPriceRange([val, localPriceRange[1]]);
                            }
                        }}
                        onBlur={() => {
                             if(localPriceRange[0] > localPriceRange[1]) {
                                 setLocalPriceRange([localPriceRange[1], localPriceRange[1]]);
                                 setPriceRange([localPriceRange[1], localPriceRange[1]]);
                             } else {
                                 setPriceRange(localPriceRange); 
                             }
                        }}
                        inputProps={{
                            min: 0,
                            max: 50000,
                            type: 'number',
                            style: { 
                                padding: 0, 
                                fontWeight: 600, 
                                fontSize: '0.875rem', 
                                color: isDarkMode ? 'white' : 'text.primary' 
                            }
                        }}
                        sx={{ color: 'inherit' }}
                    />
                 </Box>
            </Box>
            <Box sx={{ width: 10, height: 1, bgcolor: 'text.disabled' }} />
            <Box sx={{ 
                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee', 
                borderRadius: 2, 
                px: 2, 
                py: 1,
                minWidth: 80,
                textAlign: 'right'
            }}>
                 <Typography variant="caption" color="text.secondary" display="block">Max</Typography>
                 <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography variant="body2" fontWeight={600} mr={0.5}>₹</Typography>
                    <InputBase
                        value={localPriceRange[1]}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (!isNaN(val) && val >= 0 && val <= 50000) {
                                setLocalPriceRange([localPriceRange[0], val]);
                            }
                        }}
                        onBlur={() => {
                             if(localPriceRange[1] < localPriceRange[0]) {
                                 setLocalPriceRange([localPriceRange[0], localPriceRange[0]]);
                                 setPriceRange([localPriceRange[0], localPriceRange[0]]);
                             } else {
                                 setPriceRange(localPriceRange);
                             }
                        }}
                        inputProps={{
                            min: 0,
                            max: 50000,
                            type: 'number',
                            style: { 
                                padding: 0, 
                                fontWeight: 600, 
                                fontSize: '0.875rem', 
                                textAlign: 'right',
                                color: isDarkMode ? 'white' : 'text.primary'
                            }
                        }}
                        sx={{ color: 'inherit' }}
                    />
                 </Box>
            </Box>
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
                bgcolor: selectedCategory === cat ? (isDarkMode ? '#D4AF37' : '#2C2C2C') : 'transparent',
                color: selectedCategory === cat ? (isDarkMode ? '#121212' : 'white') : 'text.primary',
                transition: 'all 0.2s',
                fontWeight: selectedCategory === cat ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { bgcolor: selectedCategory === cat ? (isDarkMode ? '#D4AF37' : '#2C2C2C') : (isDarkMode ? '#2d2d2d' : '#f5f5f5') }
              }}
            >
              {cat === 'Hub' && <RecyclingIcon sx={{ fontSize: 18 }} />}
              <Typography variant="body2">{cat}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDarkMode ? '#121212' : '#fafafa' }}>
      {/* Hero Banner */}
      <Box sx={{ bgcolor: '#2C2C2C', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#D5A249', letterSpacing: 3 }}>
            {selectedCategory === 'Hub' ? 'SUSTAINABLE SHOPPING' : 'THE COLLECTION'}
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ mt: 1, fontFamily: '"Playfair Display", serif' }}>
            {selectedCategory === 'All' ? 'Shop All' : selectedCategory === 'Hub' ? 'Outlet Hub' : selectedCategory}
          </Typography>
          {selectedSubCategory && (
            <Typography variant="h5" sx={{ mt: 1, color: '#D5A249', fontFamily: '"Playfair Display", serif' }}>
              {selectedSubCategory}
            </Typography>
          )}
          <Typography variant="body1" sx={{ opacity: 0.8, mt: 2 }}>
            {selectedCategory === 'Hub'
              ? 'Premium returned items, professionally inspected and verified.'
              : 'Discover our curated selection of premium essentials'}
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
                icon={cat === 'Hub' ? <RecyclingIcon sx={{ fontSize: '16px !important' }} /> : undefined}
                onClick={() => handleCategoryChange(cat)}
                sx={{
                  bgcolor: selectedCategory === cat ? (isDarkMode ? '#D4AF37' : '#2C2C2C') : (isDarkMode ? '#1e1e1e' : 'white'),
                  color: selectedCategory === cat ? (isDarkMode ? '#121212' : 'white') : 'text.primary',
                  fontWeight: 600,
                  '&:hover': { bgcolor: selectedCategory === cat ? '#2C2C2C' : '#f0f0f0' },
                  '& .MuiChip-icon': {
                    color: selectedCategory === cat ? (isDarkMode ? '#121212' : 'white') : 'inherit'
                  }
                }}
              />
            ))}
            {selectedSubCategory && (
              <Chip
                label={selectedSubCategory}
                onDelete={() => setSelectedSubCategory(null)}
                sx={{
                  bgcolor: isDarkMode ? '#D4AF37' : '#2C2C2C',
                  color: isDarkMode ? '#121212' : 'white',
                  fontWeight: 600,
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? '#121212' : 'white',
                    '&:hover': { color: isDarkMode ? '#333' : '#ddd' }
                  }
                }}
              />
            )}
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
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: isDarkMode ? '#f5f5f5' : 'inherit' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                width: { xs: '100%', sm: 220 },
                bgcolor: isDarkMode ? '#1e1e1e' : 'white',
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#f5f5f5' : 'inherit'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? '#888' : 'inherit',
                  opacity: 1
                }
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160, bgcolor: isDarkMode ? '#1e1e1e' : 'white' }}>
              <InputLabel sx={{ color: isDarkMode ? '#888' : 'inherit', '&.Mui-focused': { color: isDarkMode ? '#D4AF37' : 'inherit' } }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: isDarkMode ? '#f5f5f5' : 'inherit',
                  '& .MuiSvgIcon-root': {
                    color: isDarkMode ? '#f5f5f5' : 'inherit'
                  }
                }}
              >
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
            <Box sx={{ bgcolor: isDarkMode ? '#1e1e1e' : 'white', p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
              <FilterContent />
            </Box>
          </Box>

          {/* Product Grid */}
          <Box sx={{ flex: 1 }}>

            {/* Hub Spotlight - Horizontal Scroll */}
            {selectedCategory === 'Hub' && hubFeaturedProducts.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RecyclingIcon color="primary" /> Hub Spotlight
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    overflowX: 'auto',
                    pb: 2,
                    '::-webkit-scrollbar': { height: 8 },
                    '::-webkit-scrollbar-thumb': { bgcolor: isDarkMode ? '#444' : '#ccc', borderRadius: 4 }
                  }}
                >
                  {hubFeaturedProducts.map(product => (
                    <Box key={`featured-${product.id}`} sx={{ minWidth: 280, maxWidth: 280 }}>
                      <ProductCard {...product} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

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
                        flex: { xs: '0 0 calc(50% - 12px)', sm: '1 1 30%', lg: '1 1 22%' },
                        maxWidth: { xs: 'calc(50% - 12px)', sm: '32%', lg: '24%' }
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
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: isDarkMode ? '#1e1e1e' : 'white', borderRadius: 2 }}>
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
