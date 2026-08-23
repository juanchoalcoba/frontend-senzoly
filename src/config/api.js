const getDevelopmentApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

const productionApiUrl = 'https://senzoly-backend-production.up.railway.app/api';

export const API_URL = (import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? productionApiUrl : getDevelopmentApiUrl())
).replace(/\/$/, '');
