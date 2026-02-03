import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';

/**
 * Type definition for the component's props.
 */
interface ThankYouPageProps {
  onGoBack: () => void;
  onComplete: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({
  onGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.container}>
        {/* Thank You Message Container */}
        <View style={styles.messageContainer}>
         
          
          <Text style={styles.thankYouText}>
            Thank You
          </Text>
          
          <Text style={styles.forSubscribingText}>
            for Subscribing
          </Text>
          
         
        </View>
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
 
  thankYouText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: PRIMARY_DARK,
    textAlign: 'center',
    marginBottom: 5,
  },
  forSubscribingText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
 
});

export default ThankYouPage;