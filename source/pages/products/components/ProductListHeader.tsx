import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import LocationIcon from '../../../icons/LocationIcon';
import { LOCATION_MESSAGES } from '../../../utils/locationService';

type Props = {
  isFetchingLocation: boolean;
  locationLabel: string;
  onPressLocation: () => void;
  searchText: string;
  onChangeSearch: (text: string) => void;
};

const ProductListHeader: React.FC<Props> = ({
  isFetchingLocation,
  locationLabel,
  onPressLocation,
  searchText,
  onChangeSearch,
}) => {
  return (
    <>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.locationWrap}
          onPress={onPressLocation}
          activeOpacity={0.8}
        >
          <LocationIcon />
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationTitle}>Pickup location</Text>
            <Text style={styles.locationValue} numberOfLines={1}>
              {isFetchingLocation ? LOCATION_MESSAGES.default : locationLabel}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          SCRAP<Text style={{ color: '#D4AF37' }}>2</Text>VALUE
        </Text>
      </View>

      <TextInput
        placeholder="Search product"
        value={searchText}
        onChangeText={onChangeSearch}
        style={styles.searchBox}
        placeholderTextColor="#999"
      />
    </>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  locationTextWrap: {
    marginLeft: 8,
    flex: 1,
  },
  locationTitle: {
    fontSize: 11,
    color: '#666',
  },
  locationValue: {
    fontSize: 12,
    color: '#1f1f1f',
    fontWeight: '600',
    marginTop: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F0F0F',
    letterSpacing: 0.8,
  },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 12,
  },
});

export default ProductListHeader;
