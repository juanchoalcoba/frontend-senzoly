const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getTenantBySlug = async (slug) => {
  const res = await fetch(`${API_URL}/public/tenant/${slug}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getAvailableSlots = async (slug, serviceId, date) => {
  const res = await fetch(`${API_URL}/public/tenant/${slug}/slots?serviceId=${serviceId}&date=${date}`);
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
