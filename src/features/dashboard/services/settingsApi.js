import { API_URL } from '../../../config/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getTenantProfile = async (token) => {
  const res = await fetch(`${API_URL}/settings/profile`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateTenantProfile = async (token, profileData) => {
  const res = await fetch(`${API_URL}/settings/profile`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getBusinessHours = async (token) => {
  const res = await fetch(`${API_URL}/settings/hours`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateBusinessHours = async (token, hoursArray) => {
  const res = await fetch(`${API_URL}/settings/hours`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ hours: hoursArray })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getBookingRules = async (token) => {
  const res = await fetch(`${API_URL}/settings/booking-rules`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateBookingRules = async (token, rules) => {
  const res = await fetch(`${API_URL}/settings/booking-rules`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(rules)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
