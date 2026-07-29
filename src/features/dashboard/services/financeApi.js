import { API_URL } from '../../../config/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
};

export const getFinancialOverview = async (token, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/dashboard${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getFinancialCharts = async (token, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/charts${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getEmployeeRanking = async (token, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/employees${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getEmployeeDetail = async (token, id, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/employees/${id}${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getFinancialMovements = async (token, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/movements${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createExpense = async (token, expenseData) => {
  const res = await fetch(`${API_URL}/financial/expenses`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(expenseData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createEmployeePayout = async (token, payoutData) => {
  const res = await fetch(`${API_URL}/financial/payouts`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(payoutData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getEmployeePayouts = async (token, params = {}) => {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_URL}/financial/payouts${qs}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
