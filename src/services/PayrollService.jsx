import api from '../utils/api';

export const getSalaryByEmployee = (employeeId) => api.get(`/salary/employee/${employeeId}`);

// export const getPayrollSummary = () => api.get('/salary/summary'); // Adjust endpoint as needed


import axios from 'axios';

export const getPayrollSummary = () => axios.get('http://localhost:8080/api/payrolls');
