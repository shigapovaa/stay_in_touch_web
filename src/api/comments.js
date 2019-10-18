import apiProcessor from './apiProcessor';

export const replyToComment = (id, text) => apiProcessor.post(`api/comments/${id}/add-answer`, { text });

export const commentPost = (id, text) => apiProcessor.post(`api/news/${id}/add-comment`, { text });

export const fetchMyComments = () => apiProcessor.get('api/comments/my');

export const fetchAnswers = () => apiProcessor.get('api/answers/');
