import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'WOMENS',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
      link: '/shop?category=Women'
    },
    {
      title: 'MENS',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c809a29?q=80&w=1000&auto=format&fit=crop',
      link: '/shop?category=Men'
    },
    {
      title: 'ACCESSORIES',
      image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=1000&auto=format&fit=crop',
      link: '/shop?category=Accessories'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
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
