import { API_URL } from '../../../config/api';

export const getStaffPortalData = async (token) => {
  const res = await fetch(`${API_URL}/staff-portal/${token}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const updateStaffBookingStatus = async (token, bookingId, status) => {
  const res = await fetch(`${API_URL}/staff-portal/${token}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};
