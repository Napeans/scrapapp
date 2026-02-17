import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

const FilterChip: React.FC<Props> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2e7d32',
  },
  filterText: {
    fontSize: 13,
    color: '#444',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterChip;
