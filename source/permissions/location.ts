// Modified: Feb 14, 2026 - Created utility to trigger Android Google Location Dialog
import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const askLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Scrap2Value Location Permission",
          message: "Allow Scrap2Value to access your location to find the nearest pickup agents.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
        return true;
      } else {
        console.log("Location permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};