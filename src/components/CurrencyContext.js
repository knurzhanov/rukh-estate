import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('KZT');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user from localStorage:', error);
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    fetchUserFromLocalStorage();
  }, []);

  const loginUser = async (loginData) => {
    try {
      const response = await axios.post('/api/auth/login', loginData);
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error, e.g., show a message to the user
    }
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error, e.g., show a message to the user
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, user, setUser, loginUser, logoutUser, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
