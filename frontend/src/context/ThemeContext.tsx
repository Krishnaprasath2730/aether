import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeConfig {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    backgroundGradient: string;
}

interface ThemeContextType {
    currentTheme: ThemeConfig;
    season: 'Winter' | 'Summer' | 'Monsoon' | 'Festival' | 'Default';
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Record<string, ThemeConfig> = {
    Winter: {
        name: 'Winter',
        colors: {
            primary: '#00bcd4', // Cyan/Ice blue
            secondary: '#ffffff',
            background: '#f0f8ff', // AliceBlue
            text: '#2c3e50',
        },
        backgroundGradient: 'linear-gradient(to bottom, #e6f7ff, #ffffff)',
    },
    Summer: {
        name: 'Summer',
        colors: {
            primary: '#ff9800', // Orange
            secondary: '#ffd700',
            background: '#fff9e6',
            text: '#5d4037',
        },
        backgroundGradient: 'linear-gradient(to bottom, #fffde7, #ffffff)',
    },
    Festival: {
        name: 'Festival',
        colors: {
            primary: '#d4af37', // Gold
            secondary: '#c0392b', // Red
            background: '#fff0f5', // LavenderBlush
            text: '#4a235a',
        },
        backgroundGradient: 'linear-gradient(to bottom, #fff0f5, #ffffff)',
    },
    Default: {
        name: 'Default',
        colors: {
            primary: '#D4AF37', // Gold
            secondary: '#2C2C2C', // Dark Grey
            background: '#ffffff',
            text: '#000000',
        },
        backgroundGradient: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
    },
    Dark: {
        name: 'Dark',
        colors: {
            primary: '#D4AF37',
            secondary: '#ffffff',
            background: '#121212',
            text: '#ffffff',
        },
        backgroundGradient: 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)',
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [season, setSeason] = useState<ThemeContextType['season']>('Default');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState<ThemeConfig>(themes.Default);

    // Initial Season Detection
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth();
        const day = date.getDate();

        let currentSeason: ThemeContextType['season'] = 'Default';

        // Check for Festivals
        if ((month === 0 && day === 1) || (month === 11 && day === 25)) {
            currentSeason = 'Festival';
        }
        // Check Seasons
        else if (month === 11 || month === 0 || month === 1) {
            currentSeason = 'Winter';
        } else if (month >= 2 && month <= 4) {
            currentSeason = 'Summer';
        }

        setSeason(currentSeason);
    }, []);

    // Update Theme when Season or Dark Mode changes
    useEffect(() => {
        if (isDarkMode) {
            setTheme(themes.Dark);
        } else {
            setTheme(themes[season] || themes.Default);
        }
    }, [season, isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, season, isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
