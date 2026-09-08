import { useCallback, useState } from 'react';
import apiClient from '../api/client';

export const useAuth = () => {
  const [token, setToken] = useState(
    () => localStorage.getItem('access_token') || null
  );

  const [loginError, setLoginError] = useState('');

  const login = useCallback(async (username, password) => {
    setLoginError('');

    try {
      const response = await apiClient.post('/token/', {
        username,
        password,
      });

      const accessToken = response.data.access;

      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);

      return true;
    } catch (error) {
      setLoginError(
        'Credenciales inválidas. Verifica tu usuario y contraseña.'
      );

      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
  }, []);

  return {
    token,
    loginError,
    login,
    logout,
  };
};