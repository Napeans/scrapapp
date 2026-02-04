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

// Import your custom screen components
import LoginScreen from './source/pages/login/login';
import VerificationScreen from './source/pages/login/verification';
import Productlist from './source/pages/products/productlist';


// Define the custom background color from your image
const BACKGROUND_COLOR = '#F0F4F2';

/**
 * Define the possible screen states for the application.
 */
type AppScreen = 'Login' | 'Verification' | 'Home' | 'LifetimeFree' | 'BookOneTime';

// Simple in-memory storage simulation (replace with AsyncStorage in real app)
class SimpleStorage {
  private storage: { [key: string]: string } = {};

  async setItem(key: string, value: string): Promise<void> {
    this.storage[key] = value;
    console.log(`Saved ${key}: ${value}`);
  }

  async getItem(key: string): Promise<string | null> {
    const value = this.storage[key];
    console.log(`Retrieved ${key}: ${value}`);
    return value || null;
  }

  async removeItem(key: string): Promise<void> {
    delete this.storage[key];
    console.log(`Removed ${key}`);
  }
}

const storage = new SimpleStorage();

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('Login');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Store booking data to pass between screens
  const [bookingData, setBookingData] = useState<any>(null);

  /**
   * Check if user is already logged in on app start
   */
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log('Checking login status...');
      const userLoggedIn = await storage.getItem('userLoggedIn');
      console.log('Login status from storage:', userLoggedIn);
      
      if (userLoggedIn === 'true') {
        console.log('User is already logged in, redirecting to Home...');
        setIsLoggedIn(true);
        setCurrentScreen('Home');
      } else {
        console.log('User is not logged in, showing Login screen...');
        setIsLoggedIn(false);
        setCurrentScreen('Login');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      // Default to login screen on error
      setCurrentScreen('Login');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles successful login
   */
  const handleLoginSuccess = async () => {
    try {
      console.log('Login successful, saving login status...');
      await storage.setItem('userLoggedIn', 'true');
      setIsLoggedIn(true);
      setCurrentScreen('Home');
    } catch (error) {
      console.log('Error saving login status:', error);
    }
  };

  /**
   * Handles navigation from Login to Verification screen.
   * Stores the mobile number to display on the Verification screen.
   */
  const handleNavigateToVerification = (mobile: string) => {
    console.log('Navigating to verification with mobile:', mobile);
    setMobileNumber(mobile);
    setCurrentScreen('Verification');
  };

  /**
   * Handles navigation from Verification to Home screen (successful login).
   */
  const handleNavigateToHome = () => {
    console.log('Verification successful, navigating to home...');
    handleLoginSuccess();
  };

  /**
   * Handles navigation back from Verification to Login screen.
   */
  const handleNavigateBackToLogin = () => {
    console.log('Navigating back to login...');
    setCurrentScreen('Login');
  };

  /**
   * Handles navigation to Lifetime Free page
   */
  const handleNavigateToLifetimeFree = () => {
    console.log('Navigating to Lifetime Free page...');
    setCurrentScreen('LifetimeFree');
  };

  /**
   * Handles navigation to Book One Time page
   */
  const handleNavigateToBookOneTime = () => {
    console.log('Navigating to Book One Time page...');
    setCurrentScreen('BookOneTime');
    // Clear any previous booking data
    setBookingData(null);
  };

  /**
   * Handles navigation back to Home
   */
  const handleNavigateBackToHome = () => {
    console.log('Navigating back to Home...');
    setCurrentScreen('Home');
  };

  /**
   * Handles navigation from BookOneTime to SchedulePickup
   */
  const handleNavigateToSchedule = (data: any) => {
    console.log('Navigating to Schedule with data:', data);
    setBookingData(data);
    // In this simple implementation, we'll navigate within BookOneTime component
    // For a full navigation stack, you'd set currentScreen to 'SchedulePickup'
  };

  /**
   * Handles logout - clears session and goes to login
   */
  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      await storage.setItem('userLoggedIn', 'false');
      setIsLoggedIn(false);
      setCurrentScreen('Login');
      // Clear any stored data
      setMobileNumber('');
      setBookingData(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  /**
   * Renders the appropriate screen based on the current state.
   */
  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34b977" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    console.log('Current screen:', currentScreen);
    console.log('Is logged in:', isLoggedIn);
    console.log('Mobile number:', mobileNumber);
    console.log('Booking data:', bookingData);

    switch (currentScreen) {
      case 'Login':
        return (
          <LoginScreen 
            onNavigateToVerification={handleNavigateToVerification} 
          />
        );
      case 'Verification':
        // Only render the Verification screen if we have a mobile number
        if (mobileNumber) {
          return (
            <VerificationScreen
              mobileNumber={mobileNumber}
              onNavigateToHome={handleNavigateToHome}
              onNavigateBack={handleNavigateBackToLogin}
            />
          );
        }
        // Fallback if mobile number is somehow missing (e.g., refresh/error)
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: Mobile number missing.</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleNavigateBackToLogin}
            >
              <Text style={styles.backButtonText}>Go Back to Login</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'Home':
        return (
          <Productlist/>
        );
      default:
        // Default to login if state is unexpected
        return <LoginScreen onNavigateToVerification={handleNavigateToVerification} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={BACKGROUND_COLOR} 
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.container}>
        {renderScreen()}
      </View>
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
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#34b977',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default App;