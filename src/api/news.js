import apiProcessor from './apiProcessor';

export const fetchNews = () => apiProcessor.get('api/news/');

export const fetchFeed = () => apiProcessor.get('api/feed');

export const fetchNewsDetails = (id) => apiProcessor.get(`api/news/${id}`);

export const createPost = (obj) => apiProcessor.post('api/news/', obj);

export const findNews = (tags) => {
  let qString = '';
  tags.split(' ').forEach((item) => {
    qString += `tag=${item}&`;
  });
  return apiProcessor.get(`api/find?${qString.slice(0, qString.length - 1)}`);
};
