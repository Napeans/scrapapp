import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';
const CARD_BG = '#FFFFFF';

interface SchedulePickupProps {
  onGoBack: () => void;
  onScheduleComplete: (data: any) => void;
  selectedItems: Array<{
    id: number;
    name: string;
    weight: string;
    unit: string;
    pricePerKg: number;
    calculatedPrice: number;
  }>;
  totalValue: number;
}

// Mock addresses (in a real app, these would come from user profile/address book)
const MOCK_ADDRESSES = [
  {
    id: 1,
    line1: '123 Main Street',
    line2: 'Apartment 4B',
    pincode: '560001',
    isDefault: true,
  },
  {
    id: 2,
    line1: '456 Park Avenue',
    line2: 'Floor 3, Unit C',
    pincode: '560002',
    isDefault: false,
  },
];

const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
];

const SchedulePickup: React.FC<SchedulePickupProps> = ({
  onGoBack,
  onScheduleComplete,
  selectedItems = [],
  totalValue = 0,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [addNewAddress, setAddNewAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState({
    line1: '',
    line2: '',
    pincode: '',
  });

  const totalWeight = selectedItems.reduce((sum, item) => {
    return sum + parseFloat(item.weight || '0');
  }, 0);

  const isFreePickup = totalWeight >= 15;
  const bookingFee = isFreePickup ? 0 : 50; // ₹50 booking fee for < 15kg
  const totalAmount = totalValue + bookingFee;

  const handleDateSelect = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
  };

  const handleContinueToConfirm = () => {
    if (!selectedAddressId && !addNewAddress) {
      Alert.alert('Address Required', 'Please select or add a pickup address');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Date Required', 'Please select a pickup date');
      return;
    }
    if (!selectedTimeSlot) {
      Alert.alert('Time Required', 'Please select a time slot');
      return;
    }

    const selectedAddress = addNewAddress 
      ? newAddress 
      : MOCK_ADDRESSES.find(a => a.id === selectedAddressId);

    const scheduleData = {
      address: selectedAddress,
      date: selectedDate,
      time: selectedTimeSlot,
      instructions,
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      totalValue,
      bookingFee,
      isFreePickup,
      totalAmount,
    };

    console.log('Schedule data:', scheduleData);
    onScheduleComplete(scheduleData);
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Pickup</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Main Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>When & Where?</Text>
            <Text style={styles.questionSubtitle}>
              Choose pickup date, time and location
            </Text>
          </View>

          {/* Pickup Location */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pickup location:</Text>
            
            {/* Existing Addresses */}
            <View style={styles.addressesContainer}>
              <Text style={styles.addressesLabel}>Saved addresses:</Text>
              {MOCK_ADDRESSES.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedAddressId === address.id && styles.addressCardSelected
                  ]}
                  onPress={() => {
                    setSelectedAddressId(address.id);
                    setAddNewAddress(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.addressCheckbox}>
                    {selectedAddressId === address.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressLine}>{address.line1}</Text>
                    <Text style={styles.addressLine}>{address.line2}</Text>
                    <Text style={styles.addressPincode}>Pincode: {address.pincode}</Text>
                    {address.isDefault && (
                      <Text style={styles.defaultBadge}>Default</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add New Address Option */}
            <View style={styles.newAddressOption}>
              <Switch
                value={addNewAddress}
                onValueChange={(value) => {
                  setAddNewAddress(value);
                  if (value) setSelectedAddressId(null);
                }}
                trackColor={{ false: '#ddd', true: PRIMARY_DARK }}
                thumbColor="#fff"
              />
              <Text style={styles.newAddressLabel}>Add new address</Text>
            </View>

            {/* New Address Form */}
            {addNewAddress && (
              <View style={styles.newAddressForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full address line 1</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAddress.line1}
                    onChangeText={(text) => setNewAddress({ ...newAddress, line1: text })}
                    placeholder="Enter street address"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full address line 2</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAddress.line2}
                    onChangeText={(text) => setNewAddress({ ...newAddress, line2: text })}
                    placeholder="Apartment, floor, landmark"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newAddress.pincode}
                    onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
                    placeholder="Enter pincode"
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Choose Date */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Choose date:</Text>
            <View style={styles.dateOptions}>
              {[0, 1, 2, 3, 4, 5, 6].map((days) => {
                const date = new Date();
                date.setDate(date.getDate() + days);
                const isToday = days === 0;
                const isSelected = selectedDate === date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.dateOption,
                      isSelected && styles.dateOptionSelected
                    ]}
                    onPress={() => handleDateSelect(days)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dateWeekday,
                      isSelected && styles.dateWeekdaySelected
                    ]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Text style={[
                      styles.dateDay,
                      isSelected && styles.dateDaySelected
                    ]}>
                      {date.getDate()}
                    </Text>
                    {isToday && (
                      <Text style={styles.todayLabel}>Today</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedDate && (
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>Selected: {selectedDate}</Text>
              </View>
            )}
          </View>

          {/* Choose Time */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Choose time:</Text>
            <View style={styles.timeOptions}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeOption,
                    selectedTimeSlot === slot && styles.timeOptionSelected
                  ]}
                  onPress={() => setSelectedTimeSlot(slot)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.timeOptionText,
                    selectedTimeSlot === slot && styles.timeOptionTextSelected
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Instructions for Collector</Text>
            <TextInput
              style={styles.instructionsInput}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Any special instructions for the collector..."
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            {/* Selected Items */}
            {selectedItems.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{item.name}</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(item.calculatedPrice)}
                </Text>
              </View>
            ))}
            
            {/* Booking Fee */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Pickup Fee {isFreePickup ? '(Free for 15+ kg)' : ''}
              </Text>
              <Text style={[styles.summaryValue, isFreePickup && styles.freeText]}>
                {isFreePickup ? 'FREE' : formatPrice(bookingFee)}
              </Text>
            </View>
            
            {/* Total */}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(totalAmount)}
              </Text>
            </View>
            
            {!isFreePickup && (
              <Text style={styles.feeNote}>
                Note: Pickup is free for bookings over 15 kg
              </Text>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedDate || !selectedTimeSlot || (!selectedAddressId && !addNewAddress)) && 
                styles.confirmButtonDisabled
            ]}
            onPress={handleContinueToConfirm}
            disabled={!selectedDate || !selectedTimeSlot || (!selectedAddressId && !addNewAddress)}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Continue to Confirm</Text>
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
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
  },
  container: {
    flex: 1,
    padding: 20,
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
  questionContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addressesContainer: {
    marginBottom: 20,
  },
  addressesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addressCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: PRIMARY_DARK,
  },
  addressCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  checkmark: {
    color: PRIMARY_DARK,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressDetails: {
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  addressPincode: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: PRIMARY_DARK,
    fontWeight: '600',
    marginTop: 4,
  },
  newAddressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  newAddressLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  newAddressForm: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  dateOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateOption: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    minWidth: 45,
  },
  dateOptionSelected: {
    backgroundColor: PRIMARY_DARK,
  },
  dateWeekday: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateWeekdaySelected: {
    color: '#fff',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateDaySelected: {
    color: '#fff',
  },
  todayLabel: {
    fontSize: 10,
    color: PRIMARY_DARK,
    marginTop: 2,
  },
  selectedDateContainer: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 14,
    color: PRIMARY_DARK,
    fontWeight: '500',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: '45%',
  },
  timeOptionSelected: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  timeOptionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: '#fff',
  },
  instructionsInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  freeText: {
    color: PRIMARY_DARK,
    fontWeight: 'bold',
  },
  feeNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_DARK,
  },
  confirmButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SchedulePickup;