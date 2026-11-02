import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '../context/AppContext';
const { calculateCartTotal } = require('../utils/cart');

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, isLoading, cartError, retryCart } = useAppContext();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);

  const checkoutTimer = useRef(null);
  useEffect(() => () => clearTimeout(checkoutTimer.current), []);
  const closePreview = () => {
    clearTimeout(checkoutTimer.current);
    setCheckoutLoading(false);
    setCheckoutModal(false);
  };

  const calculateTotal = () => {
    return calculateCartTotal(cartItems);
  };

  const handleCheckout = () => {
    setCheckoutModal(true);
    setCheckoutLoading(true);
    clearTimeout(checkoutTimer.current);
    checkoutTimer.current = setTimeout(() => {
      setCheckoutLoading(false);
    }, 2000);
  };

  const confirmCheckout = () => {
    setCheckoutModal(false);
    Alert.alert(
      'Demo only',
      'No order was submitted and no payment was processed. The demo cart will now be cleared.',
      [{ text: 'OK', onPress: async () => { try { await clearCart(); } catch { Alert.alert('Cart not cleared', 'Storage failed. Please retry.'); } } }]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <View style={styles.itemNameRow}>
          <Text style={styles.itemText}>{item.name}</Text>
          {item.isVegetarian !== undefined && (
            <View style={item.isVegetarian ? styles.vegBadge : styles.nonVegBadge}>
              <Text style={styles.vegText}>{item.isVegetarian ? 'VEG' : 'NON-VEG'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>
          Rs {item.price} Ãƒâ€” {item.quantity} = Rs {item.price * item.quantity}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Ionicons name="remove" size={20} color="#555" />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Ionicons name="add" size={20} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.headerSpacing} />
      <Text style={styles.title}>Your Cart</Text>
      {cartError && <View accessibilityRole="alert">
        <Text>{cartError}</Text>
        <TouchableOpacity onPress={retryCart}><Text>Retry cart storage</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Reset saved cart?',
          'This permanently discards the saved cart on this device.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: async () => {
              try { await clearCart(); } catch { Alert.alert('Reset failed', 'Please retry.'); }
            }}
          ])}><Text>Reset saved cart</Text></TouchableOpacity>
      </View>}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.empty}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.total}>Rs {calculateTotal()}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Preview Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {/* Checkout Modal */}
      <Modal
        visible={checkoutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Demo Order Preview</Text>
            <Text style={styles.processingText}>Preview only. No order, stock update, or payment is created.</Text>
            {checkoutLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text style={styles.processingText}>Preparing demo preview...</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.summaryItem}>
                      <View style={styles.summaryItemNameContainer}>
                        <Text style={styles.summaryItemName}>{item.name} Ãƒâ€” {item.quantity}</Text>
                        {item.isVegetarian !== undefined && (
                          <View style={styles.summaryDietIndicator}>
                            <View 
                              style={[
                                styles.dietDot, 
                                {backgroundColor: item.isVegetarian ? '#4caf50' : '#f44336'}
                              ]} 
                            />
                          </View>
                        )}
                      </View>
                      <Text style={styles.summaryItemPrice}>Rs {item.price * item.quantity}</Text>
                    </View>
                  )}
                  ListFooterComponent={
                    <View style={styles.summaryTotal}>
                      <Text style={styles.summaryTotalLabel}>Total</Text>
                      <Text style={styles.summaryTotalValue}>Rs {calculateTotal()}</Text>
                    </View>
                  }
                />
                <View style={styles.modalActions}>
                      <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={closePreview}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={confirmCheckout}
                  >
                    <Text style={styles.confirmButtonText}>Clear Demo Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerSpacing: {  
  height: 40, 
},
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f4f4f4',
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  itemDetails: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  vegBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  nonVegBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  vegText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 15,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  removeButton: {
    marginLeft: 'auto',
    backgroundColor: '#f44336',
    borderRadius: 6,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLoading: {
    alignItems: 'center',
    padding: 30,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryItemName: {
    fontSize: 16,
    flex: 1,
  },
  summaryDietIndicator: {
    marginRight: 8,
  },
  dietDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 8,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#2e7d32',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});