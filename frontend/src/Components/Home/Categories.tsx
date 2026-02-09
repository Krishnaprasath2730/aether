import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { } = useTheme();

  const categories = [
    {
      title: 'WOMEN',
      subtitle: 'NEW COLLECTION',
      image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop',
      link: '/shop?category=Women'
    },
    {
      title: 'MEN',
      subtitle: 'ESSENTIALS',
      image: ' https://i.pinimg.com/1200x/53/29/2a/53292afc709e42ee45061d4a21939540.jpg',
      link: '/shop?category=Men'
    },
    {
      title: 'ACCESSORIES',
      subtitle: 'FINISHING TOUCHES',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      link: '/shop?category=Accessories'
    }
  ];

  return (
    <Box sx={{ py: 10, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Box
              key={cat.title}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 30%' },
                position: 'relative',
                height: 300,
                backgroundImage: `url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                pb: 4
              }}
            >
              <Button
                onClick={() => navigate(cat.link)}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                {cat.title}
              </Button>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Categories;

