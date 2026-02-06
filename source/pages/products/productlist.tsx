import React, { useEffect, useState } from 'react';
import PlusIcon from '../../icons/PlusIcon';
import MinusIcon from '../../icons/MinusIcon';
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
import { BASE_URL } from '../../config/appConfig';

interface ProductSummaryScreenProps {
  onNavigateToProductSummary: () => void;
}




const ProductListScreen : React.FC<ProductSummaryScreenProps> = ({
  onNavigateToProductSummary
}) => {
  const [products, setProducts] = useState<any>([]);
   const [filters, setFilters] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [selectedScrapTypes, setSelectedScrapTypes] = useState<number[]>([0]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     LOAD PRODUCTS
  ======================= */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiCall<any>(
        apiClient.get('product/GetProductDetails/1')
      );
      setProducts(response?.productDetailsModels);
      setFilteredProducts(response.productDetailsModels);
      setFilters(response.mst_Scrap_Types)
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
const handleContinue=()=>{
onNavigateToProductSummary();

}
  /* =======================
     CART
  ======================= */
const addToCart = (item: any) => {
  setCart(prevCart => {
    const exists = prevCart.some(
      p => p.ProductId === item.ProductId
    );

    if (exists) {
      // Remove item
      return prevCart.filter(
        p => p.ProductId !== item.ProductId
      );
    }

    // Add item
    return [...prevCart, item];
  });
};


  /* =======================
     RENDER FILTER
  ======================= */
  const renderFilter = ({ item }: { item: any }) => {
    const isSelected = selectedScrapTypes.includes(item.ScrapTypeId);

    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          isSelected && styles.filterChipActive,
        ]}
        onPress={() => applyFilter(item.ScrapTypeId)}
      >
        <Text
          style={[
            styles.filterText,
            isSelected && styles.filterTextActive,
          ]}
        >
          {item.ScrapType}
        </Text>
      </TouchableOpacity>
    );
  };

  /* =======================
     RENDER PRODUCT
  ======================= */
  const renderItem: ListRenderItem<any> = ({ item }) => {
    const added = cart.some(p => p.ProductId === item.ProductId);

    return (
      <View style={styles.card}>
        <Image
          source={{ uri:(item.ProductImage)? BASE_URL+item.ProductImage : BASE_URL+'Images/imageNotAvailable.jpg' }}
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
>
  {added ? (
    <MinusIcon size={16} color="#fff" />
  ) : (
    <PlusIcon size={16} color="#fff" />
  )}

  <Text style={styles.addText}>
    {added ? 'REMOVE' : 'ADD'}
  </Text>
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
        data={filters}
        horizontal
        renderItem={renderFilter}
        keyExtractor={(item) => item.ScrapTypeId.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />

      {/* LIST AREA */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : (
          <FlatList<any>
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
          onPress={handleContinue}
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

  filterList: { marginBottom: 0 },

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

  listContainer: { flex: 10 },

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
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 18,
  backgroundColor: '#34b977',
},

addedBtn: {
  backgroundColor: '#FF3B30',
},

addText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  marginLeft: 4,
},

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
