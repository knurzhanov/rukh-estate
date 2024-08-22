import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Правильный импорт

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('KZT');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          const decodedToken = jwtDecode(token); 
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
     
            logoutUser();
          } else {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error fetching user from localStorage:', error);
      } finally {
        setIsLoading(false);
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
      // Обработка ошибки входа
    }
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Обработка ошибки выхода
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, user, setUser, loginUser, logoutUser, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
