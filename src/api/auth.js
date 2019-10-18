import apiProcessor from './apiProcessor';

export const login = (email, password) => apiProcessor.post('auth/login/', { email, password });

export const logout = () => apiProcessor.post('auth/logout/');

export const signUp = (data) => apiProcessor.post('auth/registration/', data);

export const checkAuth = () => apiProcessor.get('auth/get-current-user/');
