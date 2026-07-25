import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getBusinessTheme } from '../theme/businessThemes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { tenant } = useAuth();
  const { pathname } = useLocation();
  const [routeThemeSlug, setRouteThemeSlug] = useState(null);

  const isTenantDashboard = pathname.startsWith('/dashboard');
  const businessTypeSlug = routeThemeSlug || (
    isTenantDashboard ? tenant?.businessType?.slug : null
  );
  const theme = useMemo(() => getBusinessTheme(businessTypeSlug), [businessTypeSlug]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.businessTheme = theme.key;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-strong', theme.primaryStrong);
    root.style.setProperty('--theme-primary-soft', theme.primarySoft);
    root.style.setProperty('--theme-primary-muted', theme.primaryMuted);
    root.style.setProperty('--theme-dark', theme.dark);
    root.style.setProperty('--theme-glow', theme.glow);
  }, [theme]);

  const value = useMemo(() => ({ theme, setRouteThemeSlug }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}
