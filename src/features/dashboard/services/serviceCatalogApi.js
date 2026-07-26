const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getServices = async (token) => {
  const res = await fetch(`${API_URL}/services`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getServiceStats = async (token) => {
  const res = await fetch(`${API_URL}/services/stats`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getServiceById = async (token, id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createService = async (token, serviceData) => {
  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(serviceData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateService = async (token, id, updates) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const uploadServiceImage = async (token, id, image) => {
  const formData = new FormData();
  formData.append('image', image);

  const res = await fetch(`${API_URL}/services/${id}/image`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const deleteServiceImage = async (token, id) => {
  const res = await fetch(`${API_URL}/services/${id}/image`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
