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
import { login } from '../../api/LoginService';
import GlobalStyles,{Colors} from '../../theme/styles';
import { navigationProps } from '../../types/navigation';
/* =======================
   THEME COLORS
======================= */
const BACKGROUND_COLOR = Colors.BACKGROUND_COLOR
const PRIMARY_BLUE = Colors.PRIMARY_BLUE;
const ERROR_RED = Colors.ERROR_RED

const { height } = Dimensions.get('window');


const OTP_LENGTH = 4;
const DEFAULT_OTP = '1234';

const VerificationScreen: React.FC<navigationProps> = ({
  mobileNumber,
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useMemo(
    () => Array(OTP_LENGTH).fill(0).map(() => createRef<RNTextInput>()),
    []
  );

  const fullOtp = otp.join('');
  const isButtonEnabled = fullOtp.length === OTP_LENGTH;

  /* =======================
     OTP INPUT HANDLER
  ======================= */
  const handleChangeText = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    if (errorMessage) setErrorMessage('');

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs[index + 1].current?.focus();
    }

    if (!text && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  /* =======================
     VERIFY & LOGIN
  ======================= */
  const handleVerify = async () => {
    if (!isButtonEnabled || isVerifying) return;

    if (fullOtp !== DEFAULT_OTP) {
      setErrorMessage('Invalid OTP. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs[0].current?.focus();
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage('');
      // 🔐 LOGIN API CALL
      await login(mobileNumber, fullOtp);

      // ✅ SUCCESS
      onNavigateToHome();
    } catch (err: any) {
      console.log('Login failed:', err);

      setErrorMessage(
        err?.message || 'Login failed. Please try again.'
      );

      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs[0].current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  /* =======================
     RESEND OTP
  ======================= */
  const handleResendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMessage('');
    inputRefs[0].current?.focus();
  };

  const formattedMobileNumber = mobileNumber.replace(
    /(\d{3})(\d{5})(\d{4})/,
    '$1 $2 $3'
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          
           <Text style={GlobalStyles.headerLabel}>Enter the OTP sent to {formattedMobileNumber}</Text>

        

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  errorMessage && styles.otpInputError,
                ]}
                ref={inputRefs[index]}
                value={digit}
                onChangeText={text => handleChangeText(text, index)}
                keyboardType="numeric"
                maxLength={1}
                caretHidden
                autoFocus={index === 0}
              />
            ))}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[GlobalStyles.button, !isButtonEnabled && GlobalStyles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!isButtonEnabled || isVerifying}
          >
            <Text style={GlobalStyles.buttonText}>
              {isVerifying ? 'Verifying...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={isVerifying}
          >
            <Text style={styles.resendText}>
                <Text style={styles.resendTextBold}>Didn't get OTP?</Text>{' '} Resend in 112 sec</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerificationScreen;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  container: { flex: 1, paddingHorizontal: 30, paddingTop: height * 0.05 },
  content: { flex: 1, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 50 },
  appName: { fontSize: 24, fontWeight: 'bold', color: PRIMARY_BLUE },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  phoneNumberContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 40,
  },
  bodyText: { textAlign: 'center', color: '#666' },
  phoneNumberRow: { flexDirection: 'row', justifyContent: 'center' },
  phoneNumber: { fontWeight: '600', marginRight: 10 },
  modifyButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
    inputLabel: {
    fontSize: 35,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  modifyButtonText: { color: '#fff' },
  otpContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  otpInput: {
    width: 65,
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor:"#65AF44",
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#fff',
  },
  otpInputFilled: { borderColor: PRIMARY_BLUE },
  otpInputError: { borderColor: ERROR_RED },
  errorText: { color: ERROR_RED, marginBottom: 10 },
  button: {
    width: '100%',
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 18 },
  resendButton: { marginTop: 12,fontSize:15 },
  resendText: { color: '#333' },
  resendTextBold:{fontSize: 18}
});
