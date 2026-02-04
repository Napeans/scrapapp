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
  TextInput,
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

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<number[]>([0]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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
     FILTER + SEARCH
  ======================= */
  const applyAllFilters = (
    scrapTypes = selectedScrapTypes,
    search = searchText
  ) => {
    let list = [...products];

    if (!scrapTypes.includes(0)) {
      list = list.filter(p => scrapTypes.includes(p.ScrapTypeId));
    }

    if (search.trim()) {
      list = list.filter(p =>
        p.ProductName.toLowerCase().includes(search.toLowerCase())
      );
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

  /* =======================
     CART
  ======================= */
  const addToCart = (item: Product) => {
    if (!cart.find(p => p.ProductId === item.ProductId)) {
      setCart([...cart, item]);
    }
  };

  /* =======================
     RENDER FILTER
  ======================= */
  const renderFilter = ({ item }: { item: ScrapFilter }) => {
    const isSelected = selectedScrapTypes.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          isSelected && styles.filterChipActive,
        ]}
        onPress={() => applyFilter(item.id)}
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
  const renderItem: ListRenderItem<Product> = ({ item }) => {
    const added = cart.some(p => p.ProductId === item.ProductId);

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.ProductImage || 'https://via.placeholder.com/80' }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{item.ProductName}</Text>
          <Text style={styles.market}>Market: ₹{item.MarketPrice}</Text>
          <Text style={styles.price}>Our Price: ₹{item.OurPrice}</Text>
          <Text style={styles.unit}>{item.QuantityPerPrice}</Text>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, added && styles.addedBtn]}
          onPress={() => addToCart(item)}
          disabled={added}
        >
          <Text style={styles.addText}>{added ? 'ADDED' : 'ADD'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* =======================
     UI
  ======================= */
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>

      {/* SEARCH */}
      <TextInput
        placeholder="Search product"
        value={searchText}
        onChangeText={onSearch}
        style={styles.searchBox}
      />

      {/* FILTER */}
      <FlatList
        data={FILTERS}
        horizontal
        renderItem={renderFilter}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />

      {/* LIST AREA */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : (
          <FlatList<Product>
            data={filteredProducts}
            keyExtractor={(item) => item.ProductId.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* CONTINUE BUTTON */}
      <TouchableOpacity
        style={[
          styles.continueBtn,
          cart.length === 0 && styles.continueBtnDisabled,
        ]}
        disabled={cart.length === 0}
      >
        <Text style={styles.continueText}>
          Continue ({cart.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductListScreen;

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },

  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 12,
  },

  filterList: { marginBottom: 12 },

  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#2e7d32' },
  filterText: { fontSize: 13, color: '#444' },
  filterTextActive: { color: '#fff', fontWeight: '600' },

  listContainer: { flex: 1 },

  /* ⭐ KEY FIX */
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,   // space for Continue button
    alignItems: 'stretch',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 8 },
  info: { marginLeft: 12, flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  market: { fontSize: 12, color: '#777', marginTop: 4 },
  price: { fontSize: 13, fontWeight: 'bold', color: '#2e7d32' },
  unit: { fontSize: 11, color: '#777' },

  addBtn: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addedBtn: { backgroundColor: '#999' },
  addText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  continueBtn: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: '#2e7d32',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  continueBtnDisabled: { backgroundColor: '#aaa' },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
