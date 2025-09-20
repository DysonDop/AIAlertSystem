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
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Set initial system preference
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    // Add listener for system changes
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to auto
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme('auto');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const effectiveTheme = theme === 'auto' ? systemPreference : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('theme', theme);
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