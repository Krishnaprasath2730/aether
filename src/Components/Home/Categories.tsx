import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EastIcon from '@mui/icons-material/East';

const categories = [
  {
    title: 'Men',
    tagline: 'Refined Masculinity',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    accent: '#D5A249'
  },
  {
    title: 'Women',
    tagline: 'Timeless Elegance',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    accent: '#E8B4BC'
  },
  {
    title: 'Outerwear',
    tagline: 'Bold Layers',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1887&auto=format&fit=crop',
    accent: '#7A8B99'
  },
  {
    title: 'Footwear',
    tagline: 'Ground Breaking',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    accent: '#FF6B4A'
  },
  {
    title: 'Accessories',
    tagline: 'Final Touches',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1888&auto=format&fit=crop',
    accent: '#B8860B'
  }
];

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/shop?category=${category}`);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography 
            sx={{ 
              color: '#D5A249', 
              letterSpacing: '4px', 
              fontWeight: 600,
              fontSize: '0.8rem',
              mb: 2,
            }}
          >
            COLLECTIONS
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                fontWeight: 500,
                lineHeight: 1.1
              }}
            >
              Shop by<br />
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>Category</Box>
            </Typography>
            <Typography 
              onClick={() => navigate('/shop')}
              sx={{ 
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 500,
                '&:hover': { color: '#D5A249' },
                transition: 'color 0.3s'
              }}
            >
              View All <EastIcon fontSize="small" />
            </Typography>
          </Box>
        </Box>

        {/* Bento Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
            gridTemplateRows: { xs: 'auto', md: 'repeat(2, 300px)' },
            gap: 2.5,
          }}
        >
          {/* Large Featured Card - Men */}
          <Box
            onClick={() => handleCategoryClick('Men')}

            sx={{
              gridColumn: { xs: 'span 1', md: 'span 5' },
              gridRow: { xs: 'span 1', md: 'span 2' },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: { xs: 400, md: 'auto' },
              '&:hover .card-image': { transform: 'scale(1.05)' },
              '&:hover .card-content': { opacity: 1 },
              '&:hover .card-number': { transform: 'translateX(0)', opacity: 1 }
            }}
          >
            <Box
              className="card-image"
              component="img"
              src={categories[0].image}
              alt={categories[0].title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            <Box sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)'
            }} />
            
            {/* Large Number */}
            <Typography
              className="card-number"
              sx={{
                position: 'absolute',
                top: 30,
                right: 30,
                fontSize: { xs: '5rem', md: '8rem' },
                fontWeight: 900,
                color: 'rgba(255,255,255,0.1)',
                lineHeight: 1,
                opacity: 0,
                transform: 'translateX(20px)',
                transition: 'all 0.5s ease'
              }}
            >
              01
            </Typography>

            {/* Content */}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 3, md: 4 }, color: 'white' }}>
              <Typography sx={{ color: categories[0].accent, fontSize: '0.75rem', letterSpacing: 3, mb: 1 }}>
                {categories[0].tagline.toUpperCase()}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: '"Playfair Display", serif', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                {categories[0].title}
              </Typography>
              <Box className="card-content" sx={{ mt: 2, opacity: 0, transition: 'opacity 0.4s' }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'white', color: 'black', px: 3, py: 1, borderRadius: 50, fontWeight: 600, fontSize: '0.85rem' }}>
                  Explore <EastIcon fontSize="small" />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Women Card */}
          <Box
            onClick={() => handleCategoryClick('Women')}

            sx={{
              gridColumn: { xs: 'span 1', md: 'span 4' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: { xs: 280 },
              '&:hover .card-image': { transform: 'scale(1.05)' },
              '&:hover .card-overlay': { opacity: 0.4 }
            }}
          >
            <Box
              className="card-image"
              component="img"
              src={categories[1].image}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
            <Box className="card-overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'black', opacity: 0.3, transition: 'opacity 0.3s' }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 3, color: 'white' }}>
              <Typography sx={{ color: categories[1].accent, fontSize: '0.7rem', letterSpacing: 2, mb: 0.5 }}>
                {categories[1].tagline.toUpperCase()}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{categories[1].title}</Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EastIcon sx={{ fontSize: 18, transform: 'rotate(-45deg)' }} />
            </Box>
          </Box>

          {/* Outerwear Card */}
          <Box
            onClick={() => handleCategoryClick('Outerwear')}

            sx={{
              gridColumn: { xs: 'span 1', md: 'span 3' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: { xs: 280 },
              bgcolor: '#1a1a1a',
              '&:hover .card-image': { transform: 'scale(1.05)' },
            }}
          >
            <Box
              className="card-image"
              component="img"
              src={categories[2].image}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 3, color: 'white' }}>
              <Typography sx={{ color: categories[2].accent, fontSize: '0.7rem', letterSpacing: 2, mb: 0.5 }}>
                {categories[2].tagline.toUpperCase()}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{categories[2].title}</Typography>
            </Box>
          </Box>

          {/* Footwear Card - Wide */}
          <Box
            onClick={() => handleCategoryClick('Footwear')}

            sx={{
              gridColumn: { xs: 'span 1', md: 'span 4' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: { xs: 280 },
              bgcolor: '#f5f5f5',
              display: 'flex',
              '&:hover .card-image': { transform: 'scale(1.08) rotate(-5deg)' },
            }}
          >
            <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: categories[3].accent, fontSize: '0.7rem', letterSpacing: 2, mb: 1, fontWeight: 600 }}>
                  {categories[3].tagline.toUpperCase()}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>
                  {categories[3].title}
                </Typography>
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Shop Now <EastIcon fontSize="small" />
              </Box>
            </Box>
            <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Box
                className="card-image"
                component="img"
                src={categories[3].image}
                sx={{ 
                  position: 'absolute',
                  right: -30,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '160%',
                  maxWidth: 'none',
                  transition: 'transform 0.6s ease'
                }}
              />
            </Box>
          </Box>

          {/* Accessories Card */}
          <Box
            onClick={() => handleCategoryClick('Accessories')}

            sx={{
              gridColumn: { xs: 'span 1', md: 'span 3' },
              gridRow: { xs: 'span 1', md: 'span 1' },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: { xs: 280 },
              '&:hover .card-image': { transform: 'scale(1.05)' },
              '&:hover .shine': { left: '150%' }
            }}
          >
            <Box
              className="card-image"
              component="img"
              src={categories[4].image}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
            
            {/* Shine Effect */}
            <Box
              className="shine"
              sx={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-25deg)',
                transition: 'left 0.8s ease'
              }}
            />

            <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: 3, color: 'white' }}>
              <Typography sx={{ color: categories[4].accent, fontSize: '0.7rem', letterSpacing: 2, mb: 0.5 }}>
                {categories[4].tagline.toUpperCase()}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{categories[4].title}</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Categories;
