import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =======================
   GET / CREATE DEVICE ID
======================= */
const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    await AsyncStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

/* =======================
   LOGIN
======================= */
export const login = async (
  username: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const deviceId = await getDeviceId();

    const res = await apiClient.post('/auth/login', {
      username,
      password,
      deviceId,
    });

    await AsyncStorage.multiSet([
      ['accessToken', res.data.accessToken],
      ['refreshToken', res.data.refreshToken],
    ]);

    return res.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

/* =======================
   LOGOUT
======================= */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const deviceId = await AsyncStorage.getItem('deviceId');

    if (refreshToken && deviceId) {
      await apiClient.post('/auth/logout', {
        refreshToken,
        deviceId,
      });
    }
  } finally {
    // Always clear local data (even if API fails)
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'deviceId',
    ]);
  }
};
