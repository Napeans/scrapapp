import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { apiCall } from '../../api/apiClient';
import GlobalStyles from '../../theme/styles';
import { navigationProps } from '../../types/navigation';
import { fetchCurrentLocationLabel, LOCATION_MESSAGES } from '../../utils/locationService';
import ProductListHeader from './components/ProductListHeader';
import FilterChip from './components/FilterChip';
import ProductCard from './components/ProductCard';
import styles from './productlist.styles';

const ProductListScreen: React.FC<navigationProps> = ({
  onNavigateToProductSummary,
  onLogout,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<number[]>([0]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState(LOCATION_MESSAGES.default);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userLoggedIn',
        'userToken',
        'accessToken',
        'refreshToken',
      ]);
    } catch (error) {
      console.log('Logout Error', error);
    } finally {
      onLogout?.();
    }
  };

  const handleMorePress = () => {
    Alert.alert('More', 'Choose an action', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Logout', 'Are you sure you want to logout from Scrap2Value?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: handleLogout },
          ]);
        },
      },
    ]);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiCall<any>(apiClient.get('product/GetProductDetails/1'));
      setProducts(response?.productDetailsModels || []);
      setFilteredProducts(response?.productDetailsModels || []);
      setFilters(response?.mst_Scrap_Types || []);
    } catch (error) {
      console.log('API Error', error);
    } finally {
      setLoading(false);
    }
  };

  // Modified: Feb 14, 2026 - Auto-trigger product loading and location fetch on mount
useEffect(() => {
  // 1. Load the products from your .NET API
  loadProducts(); 
  
  // 2. Automatically start detecting the user's location for the header
  fetchCurrentLocation(); 
}, []);
  const fetchCurrentLocation = async () => {
    if (isFetchingLocation) return;

    try {
      setIsFetchingLocation(true);
      const readableLocation = await fetchCurrentLocationLabel();
      setLocationLabel(readableLocation);
    } catch (error) {
      console.log('Location fetch error', error);
      setLocationLabel(LOCATION_MESSAGES.unavailable);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const applyAllFilters = (scrapTypes = selectedScrapTypes, search = searchText) => {
    let list = [...products];

    if (!scrapTypes.includes(0)) {
      list = list.filter(p => scrapTypes.includes(p.ScrapTypeId));
    }

    if (search.trim()) {
      list = list.filter(p => p.ProductName.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredProducts(list);
  };

  const applyFilter = (scrapTypeId: number) => {
    let updated = [...selectedScrapTypes];

    if (scrapTypeId === 0) {
      updated = [0];
    } else {
      updated = updated.filter(id => id !== 0);
      updated.includes(scrapTypeId)
        ? (updated = updated.filter(id => id !== scrapTypeId))
        : updated.push(scrapTypeId);

      if (updated.length === 0) updated = [0];
    }

    setSelectedScrapTypes(updated);
    applyAllFilters(updated, searchText);
  };

  const onSearch = (text: string) => {
    setSearchText(text);
    applyAllFilters(selectedScrapTypes, text);
  };

  const handleContinue = () => {
    onNavigateToProductSummary?.();
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.some(p => p.ProductId === item.ProductId);
      if (exists) return prev.filter(p => p.ProductId !== item.ProductId);
      return [...prev, item];
    });
  };

  const renderFilter = ({ item }: { item: any }) => (
    <FilterChip
      label={item.ScrapType}
      isSelected={selectedScrapTypes.includes(item.ScrapTypeId)}
      onPress={() => applyFilter(item.ScrapTypeId)}
    />
  );

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <ProductCard
      item={item}
      added={cart.some(p => p.ProductId === item.ProductId)}
      onToggle={() => addToCart(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProductListHeader
          isFetchingLocation={isFetchingLocation}
          locationLabel={locationLabel}
          onPressLocation={fetchCurrentLocation}
          searchText={searchText}
          onChangeSearch={onSearch}
        />

        <FlatList
          data={filters}
          horizontal
          renderItem={renderFilter}
          keyExtractor={item => item.ScrapTypeId.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
        />

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2e7d32" />
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={item => item.ProductId.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[GlobalStyles.button, cart.length === 0 && GlobalStyles.buttonDisabled]}
          disabled={cart.length === 0}
          onPress={handleContinue}
        >
          <Text style={GlobalStyles.buttonText}>Continue ({cart.length})</Text>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={handleMorePress} activeOpacity={0.8}>
            <Text style={styles.navLabel}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductListScreen;
