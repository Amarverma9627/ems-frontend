import api from '../utils/api';

export const getDepartments = () => api.get('/departments');

export const addDepartment = (department) => api.post('/departments', department);

export const updateDepartment = (id, department) => api.put(`/departments/${id}`, department);

export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
