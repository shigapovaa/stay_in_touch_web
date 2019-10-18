import apiProcessor from './apiProcessor';

export const changeAvatar = (formData) => apiProcessor.post('auth/get-current-user/change-photo', formData);

export const updateProfile = (obj) => apiProcessor.patch('auth/get-current-user/', obj);
