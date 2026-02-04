import React, { useState, createRef, useMemo } from 'react';
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
  TextInput as RNTextInput,
} from 'react-native';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_BLUE = '#1E90FF';
const ERROR_RED = '#FF3B30';

// Get screen height for better responsive styling
const { height } = Dimensions.get('window');

/**
 * Type definition for the component's props. 
 */
interface VerificationScreenProps {
  /** The mobile number the code was sent to, passed from the Login screen. */
  mobileNumber: string;
  /** Callback function to handle navigation upon successful verification. */
  onNavigateToHome: () => void;
  /** Callback function to navigate back to login page */
  onNavigateBack: () => void;
}

const OTP_LENGTH = 4;
const DEFAULT_OTP = '1234';

const VerificationScreen: React.FC<VerificationScreenProps> = ({ 
  mobileNumber, 
  onNavigateToHome, 
  onNavigateBack 
}) => {
  // State to hold the 4 individual digits of the OTP
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Refs for focusing the next input field
  const inputRefs = useMemo(() => 
    Array(OTP_LENGTH).fill(0).map(() => createRef<RNTextInput>()), 
    []
  );

  // Combine the OTP array into a single string
  const fullOtp = otp.join('');
  
  // Check if all 4 digits have been entered
  const isButtonEnabled = fullOtp.length === OTP_LENGTH;

  /**
   * Handles input change for a specific OTP box.
   * Automatically moves focus to the next box upon digit entry.
   */
  const handleChangeText = (text: string, index: number) => {
    // Clear any previous error messages when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Only allow single digit input and ensure it's a number
    if (!/^\d*$/.test(text)) return;
    
    // Create a new OTP array state
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Check if the entered OTP matches the default OTP
    const currentFullOtp = newOtp.join('');
    if (currentFullOtp.length === OTP_LENGTH && currentFullOtp === DEFAULT_OTP) {
      handleVerify();
      return;
    }

    // If a digit was entered (text is not empty)
    if (text.length > 0) {
      // If it's not the last box, move focus to the next one
      if (index < OTP_LENGTH - 1) {
        inputRefs[index + 1].current?.focus();
      }
    } else if (text.length === 0 && index > 0) {
      // If a digit was deleted (text is empty), move focus to the previous one for backspace handling
      inputRefs[index - 1].current?.focus();
    }
  };

  /**
   * Handler for the "Verify + Continue" button.
   */
  const handleVerify = () => {
    if (isButtonEnabled) {
      // Check if OTP matches the default OTP
      if (fullOtp === DEFAULT_OTP) {
        setIsVerifying(true);
        setErrorMessage('');
        console.log('Verifying code:', fullOtp);
        
        // Simulate API call delay
        setTimeout(() => {
          setIsVerifying(false);
          onNavigateToHome(); 
        }, 1500);
      } else {
        console.log('Invalid OTP entered:', fullOtp);
        setErrorMessage('Invalid OTP. Please try again.');
        // Clear the OTP fields
        setOtp(Array(OTP_LENGTH).fill(''));
        // Refocus on the first input
        inputRefs[0].current?.focus();
      }
    }
  };

  /**
   * Handler for the "Resend Code" link.
   */
  const handleResendCode = () => {
    console.log('Resending verification code...');
    // Clear the OTP fields and error message
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMessage('');
    // Refocus on the first input
    inputRefs[0].current?.focus();
    // Logic for API call to resend OTP would go here.
    console.log('Default OTP is:', DEFAULT_OTP);
  };

  /**
   * Handler for phone number modification
   */
  const handleModifyPhoneNumber = () => {
    onNavigateBack();
  };

  // Format the mobile number for display (e.g., +91 94898 30540)
  const formattedMobileNumber = mobileNumber.replace(/(\d{3})(\d{5})(\d{4})/, '$1 $2 $3');

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
          <Text style={styles.heading}>Verify your account</Text>

          {/* 2. Body Text with Modify Button */}
          <View style={styles.phoneNumberContainer}>
            <Text style={styles.bodyText}>
              We have sent a 4-digit Verification Code to 
            </Text>
            <View style={styles.phoneNumberRow}>
              <Text style={styles.phoneNumber}>+91 {formattedMobileNumber}</Text>
              <TouchableOpacity
                style={styles.modifyButton}
                onPress={handleModifyPhoneNumber}
                activeOpacity={0.7}
              >
                <Text style={styles.modifyButtonText}>Modify</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput, 
                  digit.length > 0 && styles.otpInputFilled,
                  errorMessage && styles.otpInputError
                ]}
                ref={inputRefs[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                caretHidden={true}
                autoFocus={index === 0}
                returnKeyType={index === OTP_LENGTH - 1 ? 'done' : 'next'}
                onSubmitEditing={() => index < OTP_LENGTH - 1 ? inputRefs[index + 1].current?.focus() : handleVerify()}
              />
            ))}
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* 4. Button 1: Verify + Continue */}
          <TouchableOpacity
            style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={!isButtonEnabled || isVerifying}
          >
            <Text style={styles.buttonText}>
              {isVerifying ? 'Verifying...' : 'Verify and Continue'}
            </Text>
          </TouchableOpacity>

          {/* 5. Button 2: Resend Code */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            activeOpacity={0.7}
            disabled={isVerifying}
          >
            <Text style={styles.resendText}>Didn't receive code? Resend</Text>
          </TouchableOpacity>

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
    paddingTop: height * 0.05,
    backgroundColor: BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 50,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  phoneNumberContainer: {
    alignItems: 'center',
    marginBottom: 50,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  phoneNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginRight: 12,
  },
  modifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 6,
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: PRIMARY_BLUE,
    backgroundColor: '#F0F8FF',
    shadowColor: PRIMARY_BLUE,
    shadowOpacity: 0.2,
  },
  otpInputError: {
    borderColor: ERROR_RED,
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: ERROR_RED,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    backgroundColor: '#FFF0F0',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    width: '100%',
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
    marginBottom: 20,
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
  resendButton: {
    paddingVertical: 12,
  },
  resendText: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default VerificationScreen;