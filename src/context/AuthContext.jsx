import React, { createContext, useContext, useState } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => storage.get('accounts', []));
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

    const account = accounts.find((item) => item.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (!account || account.password !== password) {
      throw new Error('No account matches this email and password. Please create an account first.');
    }

    const userObj = {
      email: account.email,
      role: account.role,
      name: account.name,
      rememberMe: Boolean(rememberMe),
      loginTimestamp: new Date().toISOString()
    };

    setCurrentUser(userObj);
    setIsAuthenticated(true);
    storage.set('auth_user', userObj);

    return userObj;
  };

  const register = ({ name, email, password, confirmPassword, role }) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) throw new Error('Please enter your full name.');
    if (!validateEmailFormat(trimmedEmail)) throw new Error('Please enter a valid email address.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters long.');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') throw new Error('Please select a valid role.');
    if (accounts.some((item) => item.email.toLowerCase() === trimmedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const account = {
      id: `usr-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      password,
      role,
      createdAt: new Date().toISOString()
    };
    const nextAccounts = [...accounts, account];
    setAccounts(nextAccounts);
    storage.set('accounts', nextAccounts);
    return account;
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
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

