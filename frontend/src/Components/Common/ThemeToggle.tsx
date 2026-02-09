import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
                onClick={toggleDarkMode}
                sx={{
                    color: isDarkMode ? '#D4AF37' : '#2C2C2C',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(44, 44, 44, 0.1)',
                        transform: 'rotate(15deg)',
                    },
                }}
            >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
