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

const DARK_MODE_KEY = 'aether_dark_mode';

const lightThemes: Record<string, ThemeConfig> = {
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
    }
};

const darkThemes: Record<string, ThemeConfig> = {
    Winter: {
        name: 'Winter Dark',
        colors: {
            primary: '#00bcd4',
            secondary: '#1a1a2e',
            background: '#0f1419',
            text: '#e1e8ed',
        },
        backgroundGradient: 'linear-gradient(to bottom, #0f1419, #1a1a2e)',
    },
    Summer: {
        name: 'Summer Dark',
        colors: {
            primary: '#ff9800',
            secondary: '#1a1a1a',
            background: '#121212',
            text: '#f5f5f5',
        },
        backgroundGradient: 'linear-gradient(to bottom, #121212, #1a1a1a)',
    },
    Festival: {
        name: 'Festival Dark',
        colors: {
            primary: '#d4af37',
            secondary: '#2d2d2d',
            background: '#1a1a1a',
            text: '#f5f5f5',
        },
        backgroundGradient: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
    },
    Default: {
        name: 'Default Dark',
        colors: {
            primary: '#D4AF37', // Gold
            secondary: '#f5f5f5',
            background: '#121212',
            text: '#ffffff',
        },
        backgroundGradient: 'linear-gradient(to bottom, #121212, #1a1a1a)',
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [season, setSeason] = useState<ThemeContextType['season']>('Default');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const stored = localStorage.getItem(DARK_MODE_KEY);
        if (stored !== null) return stored === 'true';
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    });

    const themes = isDarkMode ? darkThemes : lightThemes;
    const [theme, setTheme] = useState<ThemeConfig>(themes.Default);

    // Apply dark mode class to body
    useEffect(() => {
        localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const updateTheme = () => {
            const date = new Date();
            const month = date.getMonth();
            const day = date.getDate();
            const currentThemes = isDarkMode ? darkThemes : lightThemes;

            // Check for Festivals
            if ((month === 0 && day === 1) || (month === 11 && day === 25)) {
                setSeason('Festival');
                setTheme(currentThemes.Festival);
                return;
            }

            // Check Seasons
            if (month === 11 || month === 0 || month === 1) {
                setSeason('Winter');
                setTheme(currentThemes.Winter);
            } else if (month >= 2 && month <= 4) {
                setSeason('Summer');
                setTheme(currentThemes.Summer);
            } else {
                setSeason('Default');
                setTheme(currentThemes.Default);
            }
        };

        updateTheme();
    }, [isDarkMode]);

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
