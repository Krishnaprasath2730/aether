import React from 'react';
import { Box, Typography, Backdrop, CircularProgress } from '@mui/material';
import HttpsIcon from '@mui/icons-material/Https';

interface PrivacyOverlayProps {
  isVisible: boolean;
  message?: string;
}

const PrivacyOverlay: React.FC<PrivacyOverlayProps> = ({ isVisible, message = "Host is viewing a private page" }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 9999, // Super high z-index
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'column',
        gap: 3
      }}
      open={isVisible}
    >
        <Box sx={{ p: 4, bgcolor: '#1a1a1a', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', textAlign: 'center', border: '1px solid #333' }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(108, 93, 211, 0.1)', borderRadius: '50%', mb: 2 }}>
                <HttpsIcon sx={{ fontSize: 40, color: '#6C5DD3' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                Private Session Paused
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', mt: 1 }}>
                {message}
            </Typography>
            <Typography variant="caption" sx={{ color: '#555', mt: 3 }}>
                Screen sharing is automatically suppressed for privacy theme.
            </Typography>
            <CircularProgress size={20} sx={{ mt: 2, color: '#6C5DD3' }} />
        </Box>
    </Backdrop>
  );
};

export default PrivacyOverlay;
