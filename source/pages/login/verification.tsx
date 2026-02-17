import React, { useState, createRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../api/LoginService';
import { navigationProps } from '../../types/navigation';

const OTP_LENGTH = 4;
const DEFAULT_OTP = '1234';

const VerificationScreen: React.FC<navigationProps> = ({
  mobileNumber,
  onNavigateToHome,
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

  // modified at todays date: 2026-02-13
  const handleChangeText = (text: string, index: number) => {
    const digitsOnly = text.replace(/\D/g, '');
    if (errorMessage) setErrorMessage('');

    // Supports paste like "1234" while keeping one-digit cells.
    if (digitsOnly.length > 1) {
      const newOtp = [...otp];
      digitsOnly
        .slice(0, OTP_LENGTH - index)
        .split('')
        .forEach((digit, offset) => {
          newOtp[index + offset] = digit;
        });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digitsOnly.length, OTP_LENGTH - 1);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digitsOnly;
    setOtp(newOtp);

    if (digitsOnly && index < OTP_LENGTH - 1) {
      inputRefs[index + 1].current?.focus();
    }
    if (!digitsOnly && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

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
      if (mobileNumber) {
        await login(mobileNumber, fullOtp);
      }
      onNavigateToHome?.();
    } catch (err: any) {
      console.log('Login failed:', err);
      setErrorMessage(err?.message || 'Login failed. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs[0].current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // modified at todays date: 2026-02-13
  const handleResendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMessage('');
    inputRefs[0].current?.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* modified at todays date: 2026-02-13 */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.subtitle}>
            Enter the secure code sent to{' '}
            <Text style={styles.boldPhone}>+91 {mobileNumber}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  errorMessage ? styles.otpInputError : null,
                ]}
                ref={inputRefs[index]}
                value={digit}
                onChangeText={text => handleChangeText(text, index)}
                keyboardType="numeric"
                maxLength={10}
                placeholder="-"
                placeholderTextColor="#333"
              />
            ))}
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[styles.primaryButton, !isButtonEnabled && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!isButtonEnabled || isVerifying}
          >
            <Text style={styles.buttonText}>
              {isVerifying ? 'AUTHENTICATING...' : 'VERIFY & CONTINUE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn} onPress={handleResendCode}>
            <Text style={styles.resendText}>
              Didn't receive code? <Text style={styles.goldText}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// modified at todays date: 2026-02-13
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F0F0F' },
  container: { flex: 1, paddingHorizontal: 35 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 10 },
  subtitle: { color: '#8E8E8E', textAlign: 'center', marginBottom: 40, lineHeight: 20 },
  boldPhone: { color: '#D4AF37', fontWeight: '700' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  otpInput: {
    width: 65,
    height: 75,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    color: '#D4AF37',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '700',
  },
  otpInputFilled: { borderColor: '#D4AF37', backgroundColor: '#1F1C10' },
  otpInputError: { borderColor: '#FF4D4D' },
  errorText: { color: '#FF4D4D', marginBottom: 20, fontWeight: '600' },
  primaryButton: {
    width: '100%',
    backgroundColor: '#D4AF37',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#2A2A2A' },
  buttonText: { color: '#0F0F0F', fontSize: 15, fontWeight: 'bold' },
  resendBtn: { marginTop: 30 },
  resendText: { color: '#8E8E8E', fontSize: 14 },
  goldText: { color: '#D4AF37', fontWeight: '700' },
});

export default VerificationScreen;
