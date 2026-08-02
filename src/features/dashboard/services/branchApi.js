import { API_URL } from '../../../config/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getBranches = async (token) => {
  const res = await fetch(`${API_URL}/branches`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createBranch = async (token, branchData) => {
  const res = await fetch(`${API_URL}/branches`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(branchData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateBranch = async (token, id, updates) => {
  const res = await fetch(`${API_URL}/branches/${id}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const uploadBranchImage = async (token, id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${API_URL}/branches/${id}/image`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const deleteBranchImage = async (token, id) => {
  const res = await fetch(`${API_URL}/branches/${id}/image`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const deleteBranch = async (token, id) => {
  const res = await fetch(`${API_URL}/branches/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
