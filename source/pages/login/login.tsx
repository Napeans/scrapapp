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
import GlobalStyles  ,{ Colors ,GlobalFontSize } from '../../theme/styles';

import { navigationProps } from '../../types/navigation';

const { height } = Dimensions.get('window');

const LoginScreen: React.FC<navigationProps> = ({ onNavigateToVerification }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  
  // A simple check to ensure the mobile number is 10 digits before enabling the button
  const isButtonEnabled = mobileNumber.length === 10;




  const handleGetVerificationCode = () => {
    if (isButtonEnabled) {
      onNavigateToVerification?.(mobileNumber);
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
            <Text style={GlobalStyles.headerLabel}>Enter your mobile number</Text>
            <TextInput
              style={GlobalStyles.input}
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
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingTop: height * 0.08,
    paddingBottom: 40,
    backgroundColor: Colors.BACKGROUND_COLOR,
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

  termsLabel:{
       fontSize: 15,
    color: '#333',
    marginBottom: 30,
  },
  termsLink: {
  color: "#65AF44", 
}
});


export default LoginScreen;