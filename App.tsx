import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './source/pages/login/login';
import VerificationScreen from './source/pages/login/verification';
import Productlist from './source/pages/products/productlist';
import RequestSummary from './source/pages/products/requestSummary';
import SplashScreen from './source/pages/splash/SplashScreen';
import { askLocationPermission } from './source/permissions/location';
import { requestNotificationPermission } from './source/permissions/notification';

const BACKGROUND_COLOR = '#0F0F0F';

type AppScreen = 'Login' | 'Verification' | 'Home' | 'RequestSummary';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('Login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [hasRequestedPermissions, setHasRequestedPermissions] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const requestDefaultPermissions = async () => {
      try {
        await requestNotificationPermission();
        await askLocationPermission();
      } catch (error) {
        console.log('Permission request error:', error);
      } finally {
        setHasRequestedPermissions(true);
      }
    };

    if (!isLoading && isAuthChecked && !hasRequestedPermissions) {
      requestDefaultPermissions();
    }
  }, [isLoading, isAuthChecked, hasRequestedPermissions]);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('userLoggedIn');

      if (loggedIn === 'true') {
        setCurrentScreen('Home');
      } else {
        setCurrentScreen('Login');
      }
    } catch (error) {
      console.log('Login check error:', error);
      setCurrentScreen('Login');
    } finally {
      setIsAuthChecked(true);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      await AsyncStorage.setItem('userLoggedIn', 'true');
      setCurrentScreen('Home');
    } catch (error) {
      console.log('Save login error:', error);
    }
  };

  const handleNavigateToVerification = (mobile: string) => {
    setMobileNumber(mobile);
    setCurrentScreen('Verification');
  };

  const handleNavigateToHome = () => {
    handleLoginSuccess();
  };

  const handleNavigateToProductSummary = () => {
    setCurrentScreen('RequestSummary');
  };

  const handleNavigateBackToLogin = () => {
    setCurrentScreen('Login');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userLoggedIn', 'userToken', 'accessToken', 'refreshToken']);
      setMobileNumber('');
      setCurrentScreen('Login');
    } catch (error) {
      console.log('Logout error:', error);
      setMobileNumber('');
      setCurrentScreen('Login');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return (
          <LoginScreen
            onNavigateToVerification={handleNavigateToVerification}
          />
        );

      case 'Verification':
        return (
          <VerificationScreen
            mobileNumber={mobileNumber}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToLogin={handleNavigateBackToLogin}
          />
        );

      case 'Home':
        return (
          <Productlist
            onNavigateToProductSummary={handleNavigateToProductSummary}
            onLogout={handleLogout}
          />
        );

      case 'RequestSummary':
        return (
          <RequestSummary onNavigateToProduct={handleNavigateToHome} />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.safeArea}>
      {isLoading || !isAuthChecked ? (
        <SplashScreen onAnimationFinished={() => setIsLoading(false)} />
      ) : (
        <>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <View style={styles.container}>{renderScreen()}</View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
});

export default App;
