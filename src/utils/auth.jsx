export const getToken = () => localStorage.getItem('jwtToken');

export const setToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

export const isAuthenticated = () => !!getToken();
