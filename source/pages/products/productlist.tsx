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

type Product = {
  ProductId: number;
  ScrapTypeId: number;
  ProductName: string;
  ProductImage: string;
  MarketPrice: number;
  OurPrice: number;
  QuantityPerPrice: string;
};

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await apiCall<Product[]>(
        apiClient.get('product/GetProductDetails/1')
      );
      setProducts(response);
    } catch (error) {
      console.log('API Error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{
          uri: item.ProductImage || 'https://via.placeholder.com/100',
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.ProductName}</Text>

        <Text style={styles.marketPrice}>
          Market: ₹{item.MarketPrice}
        </Text>

        <Text style={styles.price}>
          Our Price: ₹{item.OurPrice}
        </Text>

        <Text style={styles.qty}>
          {item.QuantityPerPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>

      {loading && products.length === 0 ? (
        <ActivityIndicator size="large" color="#2e7d32" />
      ) : (
        <FlatList<Product>
          data={products}
          keyExtractor={(item) => item.ProductId.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          refreshing={loading}
          onRefresh={loadPosts}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductListScreen;
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  marketPrice: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 4,
  },
  qty: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
