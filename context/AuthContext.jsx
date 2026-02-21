import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Public mode - no auth needed
  const user = { id: "public" };
  const isAuthenticated = true;

  const logout = () => {
    // No-op in public mode
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};