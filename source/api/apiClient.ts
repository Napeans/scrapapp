import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =======================
   BASE AXIOS INSTANCE
======================= */
const BASE_URL = 'http://172.20.10.6/scrap/api/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =======================
   REFRESH CONTROL
======================= */
let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token!);
  });
  failedQueue = [];
};

/* =======================
   DEVICE ID
======================= */
const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = `${Date.now()}-${Math.random()}`;
    await AsyncStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

/* =======================
   REQUEST INTERCEPTOR
======================= */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // ❌ Do NOT attach token to refresh endpoint
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const deviceId = await getDeviceId();

        if (!refreshToken) throw error;

        const response = await axios.post(
          `${BASE_URL}auth/refresh`,
          { refreshToken, deviceId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🔒 HARD LOGOUT
        await AsyncStorage.multiRemove([
          'accessToken',
          'refreshToken',
          'deviceId',
        ]);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
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
