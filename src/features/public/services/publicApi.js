import { API_URL } from '../../../config/api';

export const getTenantBySlug = async (slug, branchId = null) => {
  const url = branchId 
    ? `${API_URL}/public/tenant/${slug}?branchId=${branchId}`
    : `${API_URL}/public/tenant/${slug}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getAvailableSlots = async (slug, serviceId, employeeId, date) => {
  const params = new URLSearchParams({ serviceId, date });
  if (employeeId) params.set('employeeId', employeeId);
  const res = await fetch(`${API_URL}/public/tenant/${slug}/slots?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getAvailableProfessionals = async (slug, serviceId, branchId = null) => {
  const params = new URLSearchParams({ serviceId });
  if (branchId) params.set('branchId', branchId);
  const res = await fetch(`${API_URL}/public/tenant/${slug}/professionals?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createPublicBooking = async (slug, bookingPayload) => {
  const res = await fetch(`${API_URL}/public/tenant/${slug}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
