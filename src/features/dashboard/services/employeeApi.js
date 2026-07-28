import { API_URL } from '../../../config/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getEmployees = async (token) => {
  const res = await fetch(`${API_URL}/employees`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createEmployee = async (token, employeeData) => {
  const res = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(employeeData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateEmployee = async (token, id, updates) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const deleteEmployee = async (token, id) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const regenerateEmployeeToken = async (token, id) => {
  const res = await fetch(`${API_URL}/employees/${id}/regenerate-token`, {
    method: 'POST',
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
