import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getEmployees = () => api.get('/employees');
export const getLoggedInUser = () => api.get('/auth/user');
export const getPendingLeaves = (query = '') => api.get(`/leaves${query}`);
export const approveLeave = (id) => api.put(`/leaves/${id}/approve`);
export const rejectLeave = (id) => api.put(`/leaves/${id}/reject`);
// export const addLeave = (data) => api.post('/leaves', data);
export const addLeave = (formData) => api.post('/leaves', formData);
// export const updateLeave = (id, data) => api.put(`/leaves/${id}`, data);
// export const deleteLeave = (id) => api.delete(`/leaves/${id}`);
export const deleteLeave = (id) => api.delete(`/leaves/${id}`);
export const updateLeave = (id, data) => api.put(`/leaves/${id}`, data);

