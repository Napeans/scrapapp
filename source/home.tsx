import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';
const LIGHT_GREEN = '#E8F5E9';
const DARK_GREEN = '#2e8b57';

const { width, height } = Dimensions.get('window');

/**
 * Type definition for the component's props. 
 */
interface HomeScreenProps {
  onNavigateToDashboard: () => void;
  onNavigateToSettings: () => void;
  onNavigateToDesign: () => void;
  onLogout: () => void;
  onNavigateToLifetimeFree: () => void;
  onNavigateToBookOneTime: () => void;
}

// Responsive scaling function
const scale = (size: number) => (width / 375) * size; // Base width 375 (iPhone 6/7/8)
const verticalScale = (size: number) => (height / 812) * size; // Base height 812 (iPhone X)

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToDashboard,
  onNavigateToSettings,
  onNavigateToDesign,
  onLogout,
  onNavigateToLifetimeFree,
  onNavigateToBookOneTime,
}) => {

  const handleLifetimeFreePress = () => {
    console.log('Lifetime free button pressed');
    onNavigateToLifetimeFree();
  };

  const handleOneTimePickup = () => {
    console.log('One-time pickup booked');
    onNavigateToBookOneTime();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: verticalScale(100) } // Responsive bottom padding
        ]}
      >
        <View style={styles.container}>
          
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>♻️</Text>
              <Text style={styles.logoText}>ScrapPro</Text>
            </View>
          </View>

          {/* Main Heading */}
          <Text style={styles.heading}>Let's simplify your{'\n'}Scrap disposal</Text>

          {/* Sub Heading */}
          <Text style={styles.subHeading}>
            Select a plan below to start{'\n'}
            maximizing the value of your{'\n'}
            Scrap while minimizing clutter
          </Text>

          {/* Plan Buttons */}
          <View style={styles.plansContainer}>
            
            {/* Lifetime Free Button */}
            <TouchableOpacity 
              style={styles.lifetimeButton}
              onPress={handleLifetimeFreePress}
              activeOpacity={0.8}
            >
              <View style={styles.lifetimeButtonContent}>
                <View style={styles.lifetimeDetails}>
                  <Text style={styles.lifetimeTitle}>Lifetime Free</Text>
                  <Text style={styles.lifetimeFeature}>Enroll in 3-month scheduled</Text>
                  <Text style={styles.lifetimeFeature}>pickup plan and get free Scrap box</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Benefits Section */}
            <View style={styles.benefitsCard}>
              <View style={styles.benefitsHeader}>
                <Text style={styles.benefitsTitle}>Premium Benefits</Text>
              </View>
              <View style={styles.benefitsContent}>
                <Text style={styles.benefitText}>
                  • Eliminate clutter, get fair value and receive high Capacity Scrap Storage Kit.
                </Text>
                <Text style={styles.benefitText}>
                  • We guarantee pickup every 3 months
                </Text>
                <Text style={styles.benefitText}>
                  • Priority customer support
                </Text>
                <Text style={styles.benefitText}>
                  • Real-time tracking
                </Text>
              </View>
            </View>

            {/* One-time Pickup Button */}
            <TouchableOpacity 
              style={styles.oneTimeButton}
              onPress={handleOneTimePickup}
              activeOpacity={0.8}
            >
              <View style={styles.oneTimeButtonContent}>
                <View style={styles.oneTimeDetails}>
                  <Text style={styles.oneTimeTitle}>Book one-time Scrap Pickup</Text>
                  <Text style={styles.oneTimeSubtitle}>Instant payment • Quick service</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Explanation Text Below the Button */}
            <View style={styles.pickupExplanation}>
              <View style={styles.infoCard}>
                <View style={styles.infoContent}>
                  <Text style={styles.needCleanText}>Need to clean Scrap urgently?</Text>
                  <Text style={styles.scheduleText}>
                    Schedule a quick transport. One-time pickup and get paid instantly. 
                    Perfect for immediate disposal needs.
                  </Text>
                </View>
              </View>
            </View>

          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2K+</Text>
              <Text style={styles.statLabel}>Pickups Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Footer Navigation - Fixed for Android */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onNavigateToDashboard}>
          <Text style={styles.footerIcon}>📊</Text>
          <Text style={styles.footerButtonText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={onNavigateToSettings}>
          <Text style={styles.footerIcon}>⚙️</Text>
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={onNavigateToDesign}>
          <Text style={styles.footerIcon}>📞</Text>
          <Text style={styles.footerButtonText}>Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={onLogout}>
          <Text style={styles.footerIcon}>🚪</Text>
          <Text style={styles.footerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: Platform.OS === 'android' ? verticalScale(120) : verticalScale(100),
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(20), // Responsive horizontal padding
    paddingTop: height * 0.02,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: scale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    fontSize: scale(24),
    marginRight: scale(8),
  },
  logoText: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: PRIMARY_DARK,
  },
  heading: {
    fontSize: scale(32),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(15),
    textAlign: 'center',
    lineHeight: scale(38),
  },
  subHeading: {
    fontSize: scale(16),
    color: '#666',
    marginBottom: verticalScale(30),
    textAlign: 'center',
    lineHeight: scale(22),
    fontWeight: '500',
  },
  plansContainer: {
    width: '100%',
    gap: verticalScale(20),
  },
  lifetimeButton: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: verticalScale(20),
    borderWidth: 2,
    borderColor: PRIMARY_DARK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lifetimeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifetimeDetails: {
    flex: 1,
  },
  lifetimeTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: PRIMARY_DARK,
    marginBottom: verticalScale(5),
  },
  lifetimeFeature: {
    fontSize: scale(14),
    color: '#555',
    marginBottom: verticalScale(2),
    lineHeight: scale(18),
  },
  arrowContainer: {
    paddingLeft: scale(10),
  },
  arrow: {
    fontSize: scale(20),
    color: PRIMARY_DARK,
    fontWeight: 'bold',
  },
  benefitsCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: scale(16),
    padding: verticalScale(20),
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_DARK,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  benefitsTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: DARK_GREEN,
  },
  benefitsContent: {
    paddingLeft: scale(5),
  },
  benefitText: {
    fontSize: scale(14),
    color: DARK_GREEN,
    marginBottom: verticalScale(8),
    lineHeight: scale(18),
    fontWeight: '500',
  },
  oneTimeButton: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: verticalScale(20),
    borderWidth: 2,
    borderColor: PRIMARY_DARK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  oneTimeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oneTimeDetails: {
    flex: 1,
  },
  oneTimeTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: PRIMARY_DARK,
    marginBottom: verticalScale(4),
  },
  oneTimeSubtitle: {
    fontSize: scale(14),
    color: '#666',
    fontWeight: '500',
  },
  pickupExplanation: {
    marginTop: verticalScale(10),
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
  },
  needCleanText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(5),
  },
  scheduleText: {
    fontSize: scale(14),
    color: '#666',
    lineHeight: scale(18),
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: verticalScale(20),
    marginTop: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: PRIMARY_DARK,
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scale(12),
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: scale(10),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: scale(5),
    paddingVertical: Platform.OS === 'android' ? verticalScale(12) : verticalScale(8),
    paddingBottom: Platform.OS === 'android' ? verticalScale(20) : verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  footerIcon: {
    fontSize: scale(18),
    marginBottom: verticalScale(4),
  },
  footerButtonText: {
    fontSize: scale(11),
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
});

export default HomeScreen;