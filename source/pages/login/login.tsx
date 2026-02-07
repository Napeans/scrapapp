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
import GlobalStyles from '../../theme/styles';
// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_BLUE = '#D8FECB';
const FONT_COLOR = '#65AF44';

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
          

          {/* 3. Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your mobile number</Text>
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
            style={[GlobalStyles.button, !isButtonEnabled && GlobalStyles.buttonDisabled]}
            onPress={handleGetVerificationCode}
            activeOpacity={0.8}
            disabled={!isButtonEnabled}
          >
              <Text
    style={[
      GlobalStyles.buttonText,
      !isButtonEnabled && GlobalStyles.buttonTextDisabled,
    ]}
  >Continue</Text>
          </TouchableOpacity>

       <View style={styles.termsContainer}>
  <Text style={styles.termsLabel}>
    By continuing, you accept the{' '}
    <Text style={styles.termsLink}>Terms and Condition</Text>.
  </Text>
</View>
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
  inputContainer: {
    marginBottom: 20,
  },
    termsContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 35,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  termsLabel:{
       fontSize: 15,
    color: '#333',
    marginBottom: 30,
  },
  termsLink: {
  color: FONT_COLOR, 
},
  input: {
    height: 56,
    borderColor: FONT_COLOR,
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
  }
});


export default LoginScreen;