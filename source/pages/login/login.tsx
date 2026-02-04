import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
} from 'react-native';
// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_BLUE = '#1E90FF';

// Get screen height for better responsive styling
const { height } = Dimensions.get('window');

/**
 * Type definition for the component's props. 
 * In a real app, this would include navigation props.
 */
interface LoginScreenProps {
  // Placeholder for navigation or other props
  onNavigateToVerification: (mobile: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToVerification }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  
  // A simple check to ensure the mobile number is 10 digits before enabling the button
  const isButtonEnabled = mobileNumber.length === 10;




  const handleGetVerificationCode = () => {
    if (isButtonEnabled) {
      console.log('Requesting OTP for:', mobileNumber);
      // Actual navigation logic would go here:
      onNavigateToVerification(mobileNumber); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>♻️</Text>
            <Text style={styles.appName}>ScrapPro</Text>
          </View>

          {/* 1. Heading */}
          <Text style={styles.heading}>Let's get started!</Text>

          {/* 2. Body Text */}
          <Text style={styles.bodyText}>
            Enter your mobile number to login or create an account.
          </Text>

          {/* 3. Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={setMobileNumber}
              value={mobileNumber}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* 4. Button */}
          <TouchableOpacity
            style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
            onPress={handleGetVerificationCode}
            activeOpacity={0.8}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.buttonText}>Get Verification Code</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Bottom Text Body */}
        <View style={styles.bottomContainer}>
          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.linkText}>terms, conditions</Text> &{' '}
            <Text style={styles.linkText}>privacy policy</Text>.
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingTop: height * 0.08,
    paddingBottom: 40,
    backgroundColor: BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderColor: '#ddd',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
    shadowColor: 'transparent',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
  },
});

export default LoginScreen;