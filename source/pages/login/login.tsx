import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigationProps } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<navigationProps> = ({ onNavigateToVerification }) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  
  const isButtonEnabled = mobileNumber.length === 10;

  const handleGetVerificationCode = () => {
    console.log("Button Pressed! Number:", mobileNumber); // Debugging line
    if (isButtonEnabled) {
      if (onNavigateToVerification) {
        onNavigateToVerification(mobileNumber);
      } else {
        console.warn("Navigation prop 'onNavigateToVerification' is undefined!");
      }
    }
  };

  return (
    <View style={styles.mainWrapper}>
      {/* We skip the 'top' edge to allow the black background to hit the very top */}
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.brandText}>SCRAP<Text style={styles.goldText}>2</Text>VALUE</Text>
              <Text style={styles.tagline}>Premium Scrap Liquidation</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ENTER YOUR MOBILE NUMBER</Text>
              <View style={styles.phoneInputWrapper}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setMobileNumber}
                  value={mobileNumber}
                  placeholder="00000 00000"
                  placeholderTextColor="#444"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, !isButtonEnabled && styles.buttonDisabled]}
              onPress={handleGetVerificationCode}
              activeOpacity={0.8}
              disabled={!isButtonEnabled}
            >
              <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>
                Continue
              </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F0F0F', // This fills the status bar area
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 35,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  goldText: { color: '#D4AF37' },
  tagline: { color: '#8E8E8E', fontSize: 10, letterSpacing: 2, marginTop: 5 },
  inputContainer: { marginBottom: 40 },
  inputLabel: { color: '#D4AF37', fontSize: 12, fontWeight: '700', marginBottom: 15 },
  phoneInputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#333',
    paddingBottom: 10 
  },
  countryCode: { color: '#FFF', fontSize: 20, marginRight: 15, fontWeight: '600' },
  textInput: { flex: 1, color: '#FFF', fontSize: 20, letterSpacing: 2 },
  primaryButton: { 
    backgroundColor: '#D4AF37', 
    paddingVertical: 18, 
    borderRadius: 8, 
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#2A2A2A' },
  buttonText: { color: '#0F0F0F', fontSize: 16, fontWeight: 'bold' },
  buttonTextDisabled: { color: '#555' },
  termsContainer: { marginTop: 25, alignItems: 'center' },
  termsLabel: { fontSize: 12, color: '#555', textAlign: 'center' },
  termsLink: { color: '#D4AF37', fontWeight: '600' }
});

export default LoginScreen;
