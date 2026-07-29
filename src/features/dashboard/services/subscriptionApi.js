const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchSubscriptionStatus = async () => {
  const response = await fetch(`${API_URL}/subscriptions/status`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener estado de suscripción');
  }
  return data.data;
};

export const fetchAvailablePlans = async () => {
  const response = await fetch(`${API_URL}/subscriptions/plans`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener planes disponibles');
  }
  return data.data;
};

export const createCheckoutPreference = async (planId = null) => {
  const response = await fetch(`${API_URL}/subscriptions/create-preference`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ planId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al generar preferencia de MercadoPago');
  }
  return data.data;
};

export const fetchPaymentHistory = async () => {
  const response = await fetch(`${API_URL}/subscriptions/history`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener historial de pagos');
  }
  return data.data;
};
