import axios, { AxiosResponse } from 'axios';

/* =======================
   AXIOS CLIENT
======================= */
const apiClient = axios.create({
  baseURL: 'http://172.20.10.6/scrap/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

/* =======================
   REUSABLE API CALL
======================= */
export const apiCall = async <T>(
  request: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

export default apiClient;
