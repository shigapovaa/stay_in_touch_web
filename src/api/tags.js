import apiProcessor from './apiProcessor';

export const subscribeToTag = (id) => apiProcessor.get(`api/tags/${id}/sub`);

export const unsubscribeFromTag = (id) => apiProcessor.get(`api/tags/${id}/unsub`);
