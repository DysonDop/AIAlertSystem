import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

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
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.userId,
            email: currentUser.signInDetails?.loginId || currentUser.username,
            name: currentUser.signInDetails?.loginId?.split('@')[0] || currentUser.username,
            username: currentUser.username,
            attributes: currentUser.attributes || {}
          });
        }
      } catch (error) {
        console.log('No authenticated user found');
        // User is not signed in, which is fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        // Get user details after successful sign in
        const currentUser = await getCurrentUser();
        const userData = {
          id: currentUser.userId,
          email: currentUser.signInDetails?.loginId || email,
          name: currentUser.signInDetails?.loginId?.split('@')[0] || currentUser.username,
          username: currentUser.username,
          attributes: currentUser.attributes || {}
        };
        
        setUser(userData);
        return { success: true, user: userData };
      } else {
        // Handle other sign-in steps (MFA, password reset, etc.)
        throw new Error(`Additional step required: ${nextStep?.signInStep}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      // Handle specific Cognito errors
      switch (error.name) {
        case 'NotAuthorizedException':
          errorMessage = 'Incorrect username or password';
          break;
        case 'UserNotFoundException':
          errorMessage = 'User does not exist';
          break;
        case 'UserNotConfirmedException':
          errorMessage = 'Please confirm your email address before signing in';
          break;
        case 'TooManyRequestsException':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Invalid email or password format';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { isSignUpComplete, nextStep, userId } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name,
          },
        },
      });

      if (isSignUpComplete) {
        // Auto sign in after successful registration
        return await login(email, password);
      } else {
        // Handle confirmation step
        return {
          success: false,
          requiresConfirmation: true,
          nextStep: nextStep,
          userId: userId,
          message: 'Please check your email for verification code'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      // Handle specific Cognito errors
      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'An account with this email already exists';
          break;
        case 'InvalidPasswordException':
          errorMessage = 'Password does not meet requirements';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Invalid email format';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Update user attributes in Cognito
      const { updateUserAttributes } = await import('aws-amplify/auth');
      
      // Prepare attributes for Cognito
      const attributes = {};
      if (profileData.name) attributes.name = profileData.name;
      if (profileData.phone) attributes.phone_number = profileData.phone;
      
      if (Object.keys(attributes).length > 0) {
        await updateUserAttributes({
          userAttributes: attributes
        });
      }
      
      // Update local user state
      const updatedUser = {
        ...user,
        ...profileData,
        joinedDate: profileData.joinedDate || user.joinedDate || new Date().toISOString().split('T')[0]
      };
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  };

  // Additional helper functions for Cognito
  const confirmRegistration = async (email, code) => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      return { success: isSignUpComplete };
    } catch (error) {
      console.error('Confirmation error:', error);
      let errorMessage = 'Confirmation failed';
      
      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = 'Invalid verification code';
          break;
        case 'ExpiredCodeException':
          errorMessage = 'Verification code has expired';
          break;
        case 'LimitExceededException':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      await resendSignUpCode({
        username: email,
      });
      return { success: true };
    } catch (error) {
      console.error('Resend code error:', error);
      throw new Error(error.message || 'Failed to resend confirmation code');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    confirmRegistration,
    resendConfirmationCode,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};