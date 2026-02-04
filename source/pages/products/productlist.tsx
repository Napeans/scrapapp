import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';

import apiClient, { apiCall } from '../../api/apiClient';

/* =======================
   TYPES
======================= */
type Product = {
  ProductId: number;
  ScrapTypeId: number;
  ProductName: string;
  ProductImage: string;
  MarketPrice: number;
  OurPrice: number;
  QuantityPerPrice: string;
};

type ScrapFilter = {
  id: number;
  label: string;
};

/* =======================
   FILTER DATA
======================= */
const FILTERS: ScrapFilter[] = [
  { id: 0, label: 'All' },
  { id: 1, label: 'Iron' },
  { id: 2, label: 'Copper' },
  { id: 3, label: 'Aluminium' },
];

/* =======================
   COMPONENT
======================= */
const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<number[]>([0]);
  const [loading, setLoading] = useState<boolean>(false);

  /* =======================
     LOAD PRODUCTS
  ======================= */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiCall<Product[]>(
        apiClient.get('product/GetProductDetails/1')
      );

      setProducts(response);
      setFilteredProducts(response);
    } catch (error) {
      console.log('API Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =======================
     FILTER LOGIC (MULTI)
  ======================= */
  const applyFilter = (scrapTypeId: number) => {
    let updated = [...selectedScrapTypes];

    if (scrapTypeId === 0) {
      updated = [0];
    } else {
      updated = updated.filter(id => id !== 0);

      if (updated.includes(scrapTypeId)) {
        updated = updated.filter(id => id !== scrapTypeId);
      } else {
        updated.push(scrapTypeId);
      }

      if (updated.length === 0) {
        updated = [0];
      }
    }

    setSelectedScrapTypes(updated);

    if (updated.includes(0)) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => updated.includes(p.ScrapTypeId))
      );
    }
  };

  /* =======================
     RENDER FILTER CHIP
  ======================= */
  const renderFilter = ({ item }: { item: ScrapFilter }) => {
    const isSelected = selectedScrapTypes.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => applyFilter(item.id)}
        style={[
          styles.filterChip,
          isSelected && styles.filterChipActive,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            isSelected && styles.filterTextActive,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  /* =======================
     RENDER PRODUCT
  ======================= */
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.ProductImage || 'https://via.placeholder.com/80',
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.ProductName}</Text>
        <Text style={styles.market}>Market: ₹{item.MarketPrice}</Text>
        <Text style={styles.price}>Our Price: ₹{item.OurPrice}</Text>
        <Text style={styles.unit}>{item.QuantityPerPrice}</Text>
      </View>
    </View>
  );

  /* =======================
     UI
  ======================= */
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>

      {/* FILTER BAR */}
      <FlatList
        data={FILTERS}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFilter}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" />
      ) : (
        <FlatList<Product>
          data={filteredProducts}
          keyExtractor={(item) => item.ProductId.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductListScreen;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  /* Filter */
  filterList: {
    marginBottom: 14,
  },
  filterChip: {
    height: 40,               // ✅ FIXED HEIGHT
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#2e7d32',
  },
  filterText: {
    fontSize: 14,
    color: '#444',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  /* Card */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  market: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 2,
  },
  unit: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
});
