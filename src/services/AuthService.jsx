import api from '../utils/api';

export const login = (username, password) => {
  return api.post('/auth/signin', { username, password });
};

export const signup = (user) => {
  return api.post('/auth/signup', user);
};
