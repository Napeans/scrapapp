import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';

// Import the new Kit Delivery component
import KitDelivery from './free delivery kit';
import ThankYouPage from './subscription nothank';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';

/**
 * Type definition for the component's props.
 */
interface ConfirmAddressEligibilityProps {
  onGoBack: () => void;
  onGetKit: () => void;
  onUseOwnStorage: () => void;
}

const ConfirmAddressEligibility: React.FC<ConfirmAddressEligibilityProps> = ({
  onGoBack,
  onGetKit,
  onUseOwnStorage,
}) => {
  const [showKitDelivery, setShowKitDelivery] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Calculate dates (3 months from today)
  const getFutureDate = () => {
    const today = new Date();
    const futureDate = new Date(today.setMonth(today.getMonth() + 3));
    return futureDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleGetKit = () => {
    setShowKitDelivery(true);
  };

  const handleUseOwnStorage = () => {
    setShowThankYou(true);
  };

  const handleKitDeliveryBack = () => {
    setShowKitDelivery(false);
  };

  const handleKitDeliveryComplete = () => {
    // Navigate to home or next screen after kit delivery
    onGetKit();
  };

  const handleThankYouComplete = () => {
    // Navigate to home or next screen after thank you
    onUseOwnStorage();
  };

  const handleThankYouBack = () => {
    setShowThankYou(false);
  };

  // Show Thank You page if showThankYou is true
  if (showThankYou) {
    return (
      <ThankYouPage
        onGoBack={handleThankYouBack}
        onComplete={handleThankYouComplete}
      />
    );
  }

  // Show Kit Delivery page if showKitDelivery is true
  if (showKitDelivery) {
    return (
      <KitDelivery
        onGoBack={handleKitDeliveryBack}
        onComplete={handleKitDeliveryComplete}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enrollment Confirmed</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon/Message */}
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>You are enrolled</Text>
          <Text style={styles.successSubtitle}>
            You are now scheduled for a recurring Collection every 3 months
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>First Collection Date:</Text>
            <Text style={styles.detailValue}>
              {getFutureDate()} 
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated amount:</Text>
            <Text style={styles.detailValue}>₹75 - ₹100</Text>
          </View>
        </View>

        {/* Options Section */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Choose your storage option:</Text>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleGetKit}
          >
            <Text style={styles.optionButtonText}>Get your free storage Kit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, styles.optionButtonSecondary]}
            onPress={handleUseOwnStorage}
          >
            <Text style={[styles.optionButtonText, styles.optionButtonTextSecondary]}>
              No thanks, I have my own storage
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_DARK,
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: PRIMARY_DARK,
    textAlign: 'right',
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionButtonSecondary: {
    backgroundColor: PRIMARY_DARK,
    borderWidth: 2,
    borderColor: PRIMARY_DARK,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionButtonTextSecondary: {
    color: '#FFFFFF',
  },
});

export default ConfirmAddressEligibility;