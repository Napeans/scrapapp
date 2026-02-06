import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';

const RequestSummaryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backText}>‹</Text>
        <Text style={styles.discard}>🗑 Discard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Request summary</Text>

        {/* Location */}
        <Text style={styles.sectionLabel}>Picking up from</Text>
        <View style={styles.card}>
          <Text style={styles.locationTitle}>📍 Your Location</Text>
          <Text style={styles.subText}>
            Dhanvantri Road, Gandhi Nagar, Bengaluru
          </Text>
        </View>

        {/* Pickup Date */}
        <Text style={styles.sectionLabel}>Pickup date</Text>
        <View style={[styles.card, styles.greenCard]}>
          <View>
            <Text style={styles.bold}>Saturday</Text>
            <Text style={styles.subText}>07 February 2026</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.change}>⏱ Change</Text>
          </TouchableOpacity>
        </View>

        {/* Payment */}
        <Text style={styles.sectionLabel}>Receive payment through</Text>
        <View style={styles.cardRow}>
          <Text style={styles.greenText}>₹ Add payment method</Text>
          <View style={styles.plus}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>

        {/* Charges */}
        <Text style={styles.sectionLabel}>Fixed charges</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text>Platform Charge</Text>
            <Text>₹10</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>Handling Charge</Text>
            <Text>₹10</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>
          From where should we pick up your scrap?
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Add or select address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestSummaryScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backText: {
    fontSize: 22,
  },
  discard: {
    color: '#E53935',
    fontWeight: '600',
  },
  container: {
    padding: 16,
    paddingBottom: 140,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#777',
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  greenCard: {
    backgroundColor: '#E8FFD9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subText: {
    color: '#666',
  },
  bold: {
    fontWeight: '700',
    fontSize: 16,
  },
  change: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greenText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  plus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C8F7C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  donateBanner: {
    marginTop: 20,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  donateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
