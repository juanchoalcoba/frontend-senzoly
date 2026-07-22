import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, fetchMe } from '../features/auth/services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'SUPER_ADMIN') {
          setUser(parsedUser);
        } else {
          try {
            const data = await fetchMe(storedToken);
            setUser(data.user);
            setTenant(data.tenant);
            setSubscription(data.subscription);
            localStorage.setItem('user', JSON.stringify(data.user));
          } catch (error) {
            console.error('Error al cargar sesión:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    localStorage.setItem('token', data.token);
    
    // Obtener los datos completos del tenant tras loguearse
    try {
      const meData = await fetchMe(data.token);
      localStorage.setItem('user', JSON.stringify(meData.user));
      setUser(meData.user);
      setTenant(meData.tenant);
      setSubscription(meData.subscription);
      return meData;
    } catch (error) {
      // Si falla obtener los detalles, seteamos al menos lo básico
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    }
  };

  const loginSuperAdmin = async (credentials) => {
    const { superAdminLogin } = await import('../features/auth/services/authApi');
    const data = await superAdminLogin(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTenant(null);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, subscription, isLoading, login, loginSuperAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
