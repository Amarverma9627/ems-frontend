// /services/EmployeeService.js

import axios from 'axios';

// Axios instance with baseURL and credentials support
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Add authorization header if token present in local storage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions - use these in React components
export const getEmployees = () => api.get('/employees');

export const getEmployeeById = (id) => api.get(`/employees/${id}`);

export const addEmployee = (employee) => api.post('/employees', employee);  // <--- POST to add employee

export const updateEmployee = (id, employee) => api.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
