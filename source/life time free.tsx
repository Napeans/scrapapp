import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import ConfirmAddressEligibility from './confirm address check eligibility';

// Import the new component
// import ConfirmAddressEligibility from './confirm-address-eligibility'; // Make sure this path is correct

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';
const INPUT_BORDER = '#E0E0E0';
const INPUT_BG = '#FFFFFF';
const PLACEHOLDER_COLOR = '#999999';

/**
 * Type definition for the component's props.
 */
interface LifetimeFreeProps {
  onGoBack: () => void;
}

const LifetimeFree: React.FC<LifetimeFreeProps> = ({ onGoBack }) => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [pincode, setPincode] = useState('');
  const [isResidential, setIsResidential] = useState(true);
  const [, setUseCurrentLocation] = useState(false);
  const [showConfirmationPage, setShowConfirmationPage] = useState(false);

  const handleCheckEligibility = () => {
    // Handle eligibility check logic here
    console.log('Checking eligibility...');
    // Show the confirmation page
    setShowConfirmationPage(true);
  };

  const handleGetKit = () => {
    // Handle "Get your fun storage Kit" action
    console.log('Getting storage kit...');
    // Navigate to kit ordering or show modal
  };

  const handleUseOwnStorage = () => {
    // Handle "No thanks I have my own storage" action
    console.log('Using own storage...');
    // Continue with own storage flow
  };

  // If confirmation page should be shown, render the new component
  if (showConfirmationPage) {
    return (
      <ConfirmAddressEligibility
        onGoBack={() => setShowConfirmationPage(false)}
        onGetKit={handleGetKit}
        onUseOwnStorage={handleUseOwnStorage}
      />
    );
  }

  // Original address form screen
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm your location</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.container}>
            {/* Use Current Location Button */}
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={() => setUseCurrentLocation(true)}
            >
              <Text style={styles.currentLocationText}>📍 Use Current Location</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Please enter your address</Text>

            {/* Address Input Fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full address line 1</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter full address line 1"
                placeholderTextColor={PLACEHOLDER_COLOR}
                value={addressLine1}
                onChangeText={setAddressLine1}
                multiline={true}
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full address line 2</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter full address line 2"
                placeholderTextColor={PLACEHOLDER_COLOR}
                value={addressLine2}
                onChangeText={setAddressLine2}
                multiline={true}
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter pincode"
                placeholderTextColor={PLACEHOLDER_COLOR}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Residential Property Checkbox */}
            <View style={styles.checkboxContainer}>
              <Switch
                value={isResidential}
                onValueChange={setIsResidential}
                trackColor={{ false: '#767577', true: PRIMARY_DARK }}
                thumbColor={isResidential ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
              <Text style={styles.checkboxLabel}>
                ✓ I Confirm this is a Residential property
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.eligibilityButton}
              onPress={handleCheckEligibility}
            >
              <Text style={styles.eligibilityButtonText}>Confirm address & Check eligibility</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: PRIMARY_DARK,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  currentLocationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: PRIMARY_DARK,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  currentLocationText: {
    color: PRIMARY_DARK,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#333333',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  eligibilityButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  eligibilityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LifetimeFree;