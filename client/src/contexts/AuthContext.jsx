import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock auth functions for now
  const signIn = async (email, password) => {
    setLoading(true);
    // Mock successful login
    setUser({ email, name: 'Demo User' });
    setIsAuthenticated(true);
    setLoading(false);
    return { success: true };
  };

  const signUp = async (email, password, name) => {
    setLoading(true);
    // Mock successful signup
    setUser({ email, name });
    setIsAuthenticated(true);
    setLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    setLoading(true);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};