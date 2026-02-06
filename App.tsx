import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './source/pages/login/login';
import VerificationScreen from './source/pages/login/verification';
import Productlist from './source/pages/products/productlist';

const BACKGROUND_COLOR = '#F0F4F2';

type AppScreen = 'Login' | 'Verification' | 'Home';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('Login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     CHECK LOGIN ON APP START
  ========================= */
  useEffect(() => {
    checkLoginStatus();
  }, []);

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
      setIsLoading(false);
    }
  };

  /* =========================
     LOGIN SUCCESS
  ========================= */
  const handleLoginSuccess = async () => {
    try {
      await AsyncStorage.setItem('userLoggedIn', 'true');
      setCurrentScreen('Home');
    } catch (error) {
      console.log('Save login error:', error);
    }
  };

  /* =========================
     NAVIGATION HANDLERS
  ========================= */
  const handleNavigateToVerification = (mobile: string) => {
    setMobileNumber(mobile);
    setCurrentScreen('Verification');
  };

  const handleNavigateToHome = () => {
    handleLoginSuccess();
  };

  const handleNavigateBackToLogin = () => {
    setCurrentScreen('Login');
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userLoggedIn');
      setMobileNumber('');
      setCurrentScreen('Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  /* =========================
     SCREEN RENDER
  ========================= */
  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34b977" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

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
            onNavigateBack={handleNavigateBackToLogin}
          />
        );

      case 'Home':
        return (
          <Productlist />
          // If you want logout button later:
          // <Productlist onLogout={handleLogout} />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND_COLOR}
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.container}>{renderScreen()}</View>
    </SafeAreaView>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default App;
