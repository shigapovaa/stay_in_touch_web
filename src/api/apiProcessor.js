import axios from 'axios';
import Cookies from 'js-cookie';

const getAxiosConfig = () => {
  const token = Cookies.get('stay-in-touch-token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = token;
  }

  return {
    headers,
    baseURL: 'http://localhost:3000',
  };
};
class ApiProcessor {
  constructor() {
    this.instance = axios.create(getAxiosConfig());
  }

  use = async (url, method, body = null) => {
    const result = await this.instance[method](url, body);
    return result;
  };

  get = (url) => this.use(url, 'get');

  post = (url, body) => this.use(url, 'post', body);

  patch = (url, body) => this.use(url, 'patch', body);

  delete = (url) => this.use(url, 'delete');
}

const apiProcessor = new ApiProcessor();
export default apiProcessor;
