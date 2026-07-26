const developmentApiUrl = 'http://localhost:3000/api';
const productionApiUrl = 'https://senzoly-backend-production.up.railway.app/api';

// VITE_API_URL debe configurarse en Vercel. El valor de producción es un
// resguardo para que un deploy no vuelva a apuntar a localhost por omisión.
export const API_URL = (import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? productionApiUrl : developmentApiUrl)
).replace(/\/$/, '');
