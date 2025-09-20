import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage immediately to avoid flash
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme && ['light', 'dark', 'auto'].includes(savedTheme) ? savedTheme : 'auto';
    } catch {
      return 'auto';
    }
  });
  
  // Initialize system preference immediately
  const [systemPreference, setSystemPreference] = useState(() => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Add listener for system changes
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  // Apply theme immediately on mount and when theme/systemPreference changes
  useEffect(() => {
    const effectiveTheme = theme === 'auto' ? systemPreference : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Save theme preference (but not the effective theme)
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }, [theme, systemPreference]);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const effectiveTheme = theme === 'auto' ? systemPreference : theme;

  const value = {
    theme,
    setTheme,
    toggleTheme,
    effectiveTheme,
    isDark: effectiveTheme === 'dark',
    isAuto: theme === 'auto'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};