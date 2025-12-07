import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token with the backend
      // and fetch the user details.
      // For now, let's decode or fetch from an endpoint.
      // Assuming we can fetch profile:
       fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      // Implement a getProfile method in api service
      // const userData = await getProfile();
      // setUser(userData);

      // Temporary mock:
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      // Assuming response contains token and user
      const { access_token, user } = response;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await registerApi(userData);
      // Automatically login or redirect to login?
      // Let's assume we redirect to login for now.
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
