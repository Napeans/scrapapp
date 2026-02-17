import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PlusIcon from '../../../icons/PlusIcon';
import MinusIcon from '../../../icons/MinusIcon';
import { BASE_URL } from '../../../config/appConfig';

type Props = {
  item: any;
  added: boolean;
  onToggle: () => void;
};

const ProductCard: React.FC<Props> = ({ item, added, onToggle }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.ProductImage
            ? BASE_URL + item.ProductImage
            : BASE_URL + 'Images/imageNotAvailable.jpg',
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.ProductName}</Text>

        {Number(item.OurPrice) === Number(item.MarketPrice) ? (
          <Text style={styles.price}>Price: Rs {item.OurPrice}</Text>
        ) : (
          <>
            <Text style={styles.market}>Market: Rs {item.MarketPrice}</Text>
            <Text style={styles.price}>Our Price: Rs {item.OurPrice}</Text>
          </>
        )}

        <Text style={styles.unit}>Per {item.QuantityPerPrice}</Text>
      </View>

      <TouchableOpacity
        style={[styles.addBtn, added && styles.addedBtn]}
        onPress={onToggle}
      >
        {added ? (
          <MinusIcon size={16} color="#fff" />
        ) : (
          <PlusIcon size={16} color="#fff" />
        )}

        <Text style={styles.addText}>{added ? 'REMOVE' : 'ADD'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
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
  },
  unit: {
    fontSize: 11,
    color: '#777',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 85,
    backgroundColor: '#34b977',
  },
  addedBtn: {
    backgroundColor: '#FF3B30',
  },
  addText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ProductCard;
