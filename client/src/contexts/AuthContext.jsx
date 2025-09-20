import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        const userData = {
          id: '1',
          email: email,
          name: email.split('@')[0]
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call - replace with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid input
      const userData = {
        id: '1',
        email: email,
        name: name
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};