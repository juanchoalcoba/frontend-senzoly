const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchBusinessTypes = async () => {
  const res = await fetch(`${API_URL}/catalogs/business-types`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data; // Array de rubros
};

export const registerCompany = async (payload) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al registrar');
  return data;
};

export const verifyEmail = async (token) => {
  const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al verificar correo');
  return data;
};

export const requestPasswordReset = async (email) => {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'No fue posible solicitar la recuperación');
  return data;
};

export const resetPassword = async (payload) => {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'No fue posible actualizar la contraseña');
  return data;
};

export const login = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al iniciar sesión');
  return data.data; // Retorna { token, user }
};

export const fetchMe = async (token) => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al obtener datos del usuario');
  return data.data; // Retorna { user, tenant, subscription }
};

export const superAdminLogin = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/super-admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al iniciar sesión');
  return data.data; // Retorna { token, user }
};

export const getSuperAdminStats = async (token) => {
  const res = await fetch(`${API_URL}/super-admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getSuperAdminTenants = async (token) => {
  const res = await fetch(`${API_URL}/super-admin/tenants`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
