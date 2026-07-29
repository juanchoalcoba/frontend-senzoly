import { API_URL } from '../../../config/api';

const createApiError = (data, fallbackMessage) => {
  const error = new Error(data.message || fallbackMessage);
  error.code = data.errors?.[0]?.code;
  error.tenantStatus = data.errors?.[0]?.status;
  return error;
};

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
  if (!data.success) throw createApiError(data, 'Error al iniciar sesión');
  return data.data; // Retorna { token, user }
};

export const fetchMe = async (token) => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al obtener datos del usuario');
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

export const getSuperAdminTenant = async (token, tenantId) => {
  const res = await fetch(`${API_URL}/super-admin/tenants/${tenantId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al obtener empresa');
  return data.data;
};

export const suspendSuperAdminTenant = async (token, tenantId) => {
  const res = await fetch(`${API_URL}/super-admin/tenants/${tenantId}/suspend`, {
    method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al suspender empresa');
  return data.data;
};

export const reactivateSuperAdminTenant = async (token, tenantId) => {
  const res = await fetch(`${API_URL}/super-admin/tenants/${tenantId}/reactivate`, {
    method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al reactivar empresa');
  return data.data;
};

export const deleteSuperAdminTenant = async (token, tenantId) => {
  const res = await fetch(`${API_URL}/super-admin/tenants/${tenantId}`, {
    method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al eliminar empresa');
  return data.data;
};

export const getSuperAdminSubscriptions = async (token) => {
  const res = await fetch(`${API_URL}/super-admin/subscriptions`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al obtener suscripciones');
  return data.data;
};

export const getSuperAdminPlans = async (token) => {
  const res = await fetch(`${API_URL}/super-admin/plans`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw createApiError(data, 'Error al obtener planes');
  return data.data;
};

