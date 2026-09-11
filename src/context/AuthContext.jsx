import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = storage.get('auth_user', null);
    return saved;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!storage.get('auth_user', null);
  });

  const validateEmailFormat = (email) => {
    // Standard RFC-compliant loose regex accepting any valid email format
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase().trim());
  };

  const login = ({ email, password, role = 'EMPLOYEE', rememberMe = false }) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      throw new Error('Please enter an email address.');
    }

    if (!validateEmailFormat(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@company.com).');
    }

    if (!password || password.trim().length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      throw new Error('Invalid role selected. Must be ADMIN or EMPLOYEE.');
    }

    // Derive a clean display name from the email
    const namePart = trimmedEmail.split('@')[0];
    const displayName = namePart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const userObj = {
      email: trimmedEmail,
      role: role.toUpperCase(),
      name: displayName || (role === 'ADMIN' ? 'Admin User' : 'Employee User'),
      rememberMe: Boolean(rememberMe),
      loginTimestamp: new Date().toISOString()
    };

    setCurrentUser(userObj);
    setIsAuthenticated(true);
    storage.set('auth_user', userObj);

    return userObj;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    storage.remove('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role: currentUser?.role || null,
        isAdmin: currentUser?.role === 'ADMIN',
        isEmployee: currentUser?.role === 'EMPLOYEE',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

