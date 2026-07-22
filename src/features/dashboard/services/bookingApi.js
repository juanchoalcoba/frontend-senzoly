const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getBookings = async (token, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.date) params.append('date', filters.date);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const res = await fetch(`${API_URL}/bookings?${params.toString()}`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getBookingStats = async (token) => {
  const res = await fetch(`${API_URL}/bookings/stats`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateBookingStatus = async (token, id, status) => {
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
