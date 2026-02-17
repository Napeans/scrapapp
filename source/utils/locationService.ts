// Modified: Feb 14, 2026 - Service to fetch readable address using Geolocation
import { PermissionsAndroid, Platform } from 'react-native';

export const LOCATION_MESSAGES = {
  default: "Detecting location...",
  unavailable: "Location unavailable",
};

export const fetchCurrentLocationLabel = async () => {
  // Logic: In a real app, you would use 'react-native-geolocation-service' here.
  // For now, let's simulate a professional response to match your Summary.
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // This matches the location in your RequestSummary.tsx
      resolve("Gandhi Nagar, Bengaluru"); 
    }, 1500);
  });
};