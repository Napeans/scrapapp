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
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

// --- Theme Colors ---
const BACKGROUND_COLOR = '#F0F4F2';
const PRIMARY_DARK = '#34b977';
const CARD_BG = '#FFFFFF';
const ITEM_BG = '#F8F9FA';

// Import SchedulePickup and ConfirmBooking components
import SchedulePickup from './continue to schedule';
import ConfirmBooking from './confirm booking';

// Scrap item types with their base price per kg
const SCRAP_ITEMS = [
  { id: 1, name: 'Newspaper', pricePerKg: 20, unit: 'kg' },
  { id: 2, name: 'Plastic', pricePerKg: 17, unit: 'kg' },
  { id: 3, name: 'Coconut shell', pricePerKg: 20, unit: 'kg' },
  { id: 4, name: 'Cardboard', pricePerKg: 10, unit: 'kg' },
  { id: 5, name: 'Washing machine', pricePerKg: 11, unit: 'piece' },
];

/**
 * Type definition for the component's props.
 */
interface BookOneTimeProps {
  onGoBack: () => void;
  onNavigateToSchedule?: (data: any) => void;
}

interface ItemSelection {
  id: number;
  name: string;
  weight: string;
  unit: string;
  pricePerKg: number;
  calculatedPrice: number;
}

type ScreenState = 'items' | 'schedule' | 'confirm';

const BookOneTime: React.FC<BookOneTimeProps> = ({ onGoBack }) => {
  const [selectedItems, setSelectedItems] = useState<ItemSelection[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('items');
  const [scheduleData, setScheduleData] = useState<any>(null);

  const getItemPricePerKg = (itemId: number): number => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = SCRAP_ITEMS.find(item => item.id === itemId);
    return item?.pricePerKg || 0;
  };

  const getItemUnit = (itemId: number): string => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = SCRAP_ITEMS.find(item => item.id === itemId);
    return item?.unit || 'kg';
  };

  const getItemName = (itemId: number): string => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = SCRAP_ITEMS.find(item => item.id === itemId);
    return item?.name || '';
  };

  const handleWeightChange = (itemId: number, weight: string) => {
    // Allow only numbers and one decimal point
    const numericWeight = weight.replace(/[^0-9.]/g, '');
    const parts = numericWeight.split('.');
    if (parts.length > 2) return; // Only allow one decimal point
    
    const updatedItems = [...selectedItems];
    const itemIndex = updatedItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      // Add new item
      const pricePerKg = getItemPricePerKg(itemId);
      const calculatedPrice = parseFloat(numericWeight || '0') * pricePerKg;
      updatedItems.push({
        id: itemId,
        name: getItemName(itemId),
        weight: numericWeight,
        unit: getItemUnit(itemId),
        pricePerKg: pricePerKg,
        calculatedPrice
      });
    } else {
      // Update existing item
      const pricePerKg = getItemPricePerKg(itemId);
      const calculatedPrice = parseFloat(numericWeight || '0') * pricePerKg;
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        weight: numericWeight,
        calculatedPrice
      };
    }
    
    setSelectedItems(updatedItems);
    calculateTotalValue(updatedItems);
  };

  const toggleItemSelection = (itemId: number) => {
    const itemIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      // Add item with default weight
      const newItem: ItemSelection = {
        id: itemId,
        name: getItemName(itemId),
        weight: '',
        unit: getItemUnit(itemId),
        pricePerKg: getItemPricePerKg(itemId),
        calculatedPrice: 0
      };
      setSelectedItems([...selectedItems, newItem]);
    } else {
      // Remove item
      const updatedItems = selectedItems.filter(item => item.id !== itemId);
      setSelectedItems(updatedItems);
      calculateTotalValue(updatedItems);
    }
  };

  const calculateTotalValue = (items: ItemSelection[]) => {
    let total = 0;
    items.forEach(item => {
      total += item.calculatedPrice;
    });
    setTotalValue(total);
  };

  const isItemSelected = (itemId: number): boolean => {
    return selectedItems.some(item => item.id === itemId);
  };

  const getItemWeight = (itemId: number): string => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = selectedItems.find(item => item.id === itemId);
    return item?.weight || '';
  };

  const handleContinueToSchedule = () => {
    // Validate that all selected items have weight
    const itemsWithoutWeight = selectedItems.filter(item => !item.weight || parseFloat(item.weight) <= 0);
    
    if (itemsWithoutWeight.length > 0) {
      Alert.alert('Incomplete Information', 'Please enter weight for all selected items');
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item');
      return;
    }

    // Navigate to scheduling page
    setCurrentScreen('schedule');
  };

  const handleScheduleComplete = (data: any) => {
    // Store schedule data and navigate to confirmation
    setScheduleData(data);
    setCurrentScreen('confirm');
  };

  const handleConfirmBooking = () => {
    // Handle booking confirmation
    const bookingSummary = {
      items: selectedItems,
      totalValue: totalValue,
      schedule: scheduleData,
      bookingId: 'BK-' + Date.now().toString().slice(-8),
      bookingDate: new Date().toISOString(),
    };

    console.log('Booking confirmed:', bookingSummary);
    
    Alert.alert(
      'Booking Confirmed!',
      `Your booking has been confirmed successfully!\n\nBooking ID: ${bookingSummary.bookingId}\nTotal Amount: ₹${(totalValue + (scheduleData?.bookingFee || 0)).toFixed(2)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset and go back to home
            setSelectedItems([]);
            setTotalValue(0);
            setScheduleData(null);
            setCurrentScreen('items');
            onGoBack();
          },
        },
      ]
    );
  };

  const handleBackFromSchedule = () => {
    setCurrentScreen('items');
  };

  const handleBackFromConfirm = () => {
    setCurrentScreen('schedule');
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
  };

  // Render SchedulePickup page
  if (currentScreen === 'schedule') {
    return (
      <SchedulePickup
        onGoBack={handleBackFromSchedule}
        onScheduleComplete={handleScheduleComplete}
        selectedItems={selectedItems}
        totalValue={totalValue}
      />
    );
  }

  // Render ConfirmBooking page
  if (currentScreen === 'confirm') {
    return (
      <ConfirmBooking
        onGoBack={handleBackFromConfirm}
        onConfirmBooking={handleConfirmBooking}
        selectedItems={selectedItems}
        totalValue={totalValue}
        scheduleData={scheduleData}
      />
    );
  }

  // Render Items selection page (default)
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Scrap Pickup</Text>
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
          <View style={styles.container}>
            {/* Main Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionTitle}>What are you selling today?</Text>
              <Text style={styles.questionSubtitle}>
                Select items and enter weight for each
              </Text>
            </View>

            {/* Items Selection */}
            <View style={styles.itemsContainer}>
              <Text style={styles.sectionTitle}>Items</Text>
              
              {SCRAP_ITEMS.map((item) => {
                const isSelected = isItemSelected(item.id);
                const weight = getItemWeight(item.id);
                const unit = getItemUnit(item.id);
                
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.itemCardSelected
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.itemHeader}
                      onPress={() => toggleItemSelection(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.itemLeft}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>
                          ₹{item.pricePerKg}/{unit}
                        </Text>
                      </View>
                      <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                    
                    {isSelected && (
                      <View style={styles.weightInputContainer}>
                        <Text style={styles.weightLabel}>Enter weight ({unit}):</Text>
                        <View style={styles.weightInputRow}>
                          <TextInput
                            style={styles.weightInput}
                            value={weight}
                            onChangeText={(text) => handleWeightChange(item.id, text)}
                            placeholder={`0.00 ${unit}`}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#999"
                          />
                          {weight && (
                            <Text style={styles.calculatedPrice}>
                              = {formatPrice(parseFloat(weight || '0') * item.pricePerKg)}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Total Value Card */}
            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total estimated pickup value:</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(totalValue)}
                </Text>
              </View>
              <Text style={styles.totalNote}>
                *Price calculated based on entered weights
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity 
              style={[
                styles.continueButton,
                (selectedItems.length === 0 || totalValue === 0) && styles.continueButtonDisabled
              ]}
              onPress={handleContinueToSchedule}
              disabled={selectedItems.length === 0 || totalValue === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Continue to Schedule 
              </Text>
            </TouchableOpacity>

            {/* Summary Section */}
            {selectedItems.length > 0 && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Selected Items:</Text>
                {selectedItems.map((item) => (
                  <View key={item.id} style={styles.summaryItem}>
                    <Text style={styles.summaryItemName}>{item.name}</Text>
                    <Text style={styles.summaryItemDetails}>
                      {item.weight} {item.unit} × ₹{item.pricePerKg}/{item.unit} = {formatPrice(item.calculatedPrice)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
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
  itemsContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: ITEM_BG,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: PRIMARY_DARK,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: PRIMARY_DARK,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weightInputContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  weightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
  },
  calculatedPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_DARK,
  },
  totalCard: {
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_DARK,
  },
  totalNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  summaryItemDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default BookOneTime;