import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, fetchMe } from '../features/auth/services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isTenantSuspended, setIsTenantSuspended] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'SUPER_ADMIN') {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          try {
            const data = await fetchMe(storedToken);
            setUser(data.user);
            setTenant(data.tenant);
            setSubscription(data.subscription);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(data.user));
          } catch (error) {
            console.error('Error al cargar sesión:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setIsTenantSuspended(error.code === 'TENANT_UNAVAILABLE' && error.tenantStatus === 'suspended');
          }
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (credentials) => {
    let data;
    try {
      data = await apiLogin(credentials);
    } catch (error) {
      setIsTenantSuspended(error.code === 'TENANT_UNAVAILABLE' && error.tenantStatus === 'suspended');
      throw error;
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setIsTenantSuspended(false);
    
    // Obtener los datos completos del tenant tras loguearse
    try {
      const meData = await fetchMe(data.token);
      localStorage.setItem('user', JSON.stringify(meData.user));
      setUser(meData.user);
      setTenant(meData.tenant);
      setSubscription(meData.subscription);
      return meData;
    } catch (error) {
      if (error.code === 'TENANT_UNAVAILABLE') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setIsTenantSuspended(error.tenantStatus === 'suspended');
        throw error;
      }
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
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTenant(null);
    setSubscription(null);
    setToken(null);
    setIsTenantSuspended(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, tenant, subscription, isLoading, isTenantSuspended, login, loginSuperAdmin, logout }}>
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
