const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getCustomers = async (token, search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_URL}/customers${query}`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getCustomerById = async (token, id) => {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateCustomer = async (token, id, updates) => {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getCustomerStats = async (token) => {
  const res = await fetch(`${API_URL}/customers/stats`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
