import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { addCartItem, removeCartItem, updateCartQuantity } = require('../utils/cart');

const { createCartPersistence } = require('../utils/cartPersistence');

// Sample menu data with proper vegetarian classification
// Moved to the context for centralized management
const initialMenuItems = [
  {
    id: '1',
    name: 'Grilled Chicken Burger',
    categoryId: '1',
    price: 150,
    ingredients: ['Grilled chicken breast', 'Lettuce', 'Tomato', 'Garlic sauce'],
    image: null, // Will be set in runtime
    description: 'Juicy grilled chicken with fresh vegetables and our special garlic sauce.',
    isVegetarian: false
  },
  {
    id: '2',
    name: 'Veggie Delight Burger',
    categoryId: '1',
    price: 90,
    ingredients: ['Vegetable patty', 'Lettuce', 'Tomato', 'Mayonnaise'],
    image: null,
    description: 'Plant-based patty with crisp fresh vegetables and creamy mayo.',
    isVegetarian: true
  },
  {
    id: '3',
    name: 'Paneer Wrap',
    categoryId: '4',
    price: 130,
    ingredients: ['Paneer', 'Lettuce', 'Green chutney', 'Tortilla wrap'],
    image: null,
    description: 'Fresh paneer with crisp lettuce and zesty green chutney in a soft tortilla.',
    isVegetarian: true
  },
  {
    id: '4',
    name: 'Mushroom Pizza',
    categoryId: '3',
    price: 210,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mushrooms', 'Cheese'],
    image: null,
    description: 'Thin crust pizza topped with sautÃ©ed mushrooms and melted cheese.',
    isVegetarian: true
  },
  {
    id: '5',
    name: 'Sweetcorn Salad',
    categoryId: '7',
    price: 80,
    ingredients: ['Sweetcorn', 'Lettuce', 'Vinaigrette', 'Cherry tomatoes'],
    image: null,
    description: 'Fresh and healthy salad with sweet corn kernels and tangy vinaigrette.',
    isVegetarian: true
  },
  {
    id: '6',
    name: 'French Fries',
    categoryId: '2',
    price: 60,
    ingredients: ['Potatoes', 'Salt'],
    image: null,
    description: 'Crispy golden fries seasoned with salt.',
    isVegetarian: true
  },
  {
    id: '7',
    name: 'Iced Tea',
    categoryId: '5',
    price: 40,
    ingredients: ['Black tea', 'Ice', 'Lemon', 'Sugar'],
    image: null,
    description: 'Refreshing iced tea with a hint of lemon.',
    isVegetarian: true
  },
  {
    id: '8',
    name: 'Chocolate Brownie',
    categoryId: '6',
    price: 70,
    ingredients: ['Flour', 'Cocoa powder', 'Chocolate chips', 'Butter', 'Sugar', 'Eggs'],
    image: null,
    description: 'Rich chocolate brownie with chocolate chips.',
    isVegetarian: false // Contains eggs, marked as non-vegetarian
  },
  {
    id: '9',
    name: 'Chicken Caesar Salad',
    categoryId: '7',
    price: 130,
    ingredients: ['Grilled chicken breast', 'Romaine lettuce', 'Croutons', 'Parmesan', 'Eggs'],
    image: null,
    description: 'Classic Caesar salad with grilled chicken and homemade dressing.',
    isVegetarian: false // Contains chicken and eggs
  },
  {
    id: '10',
    name: 'Spicy Chicken Wrap',
    categoryId: '4',
    price: 140,
    ingredients: ['Spicy chicken patty', 'Lettuce', 'Sriracha', 'Mayonnaise', 'Tortilla wrap'],
    image: null,
    description: 'Spicy chicken with fresh veggies and sriracha sauce in a tortilla wrap.',
    isVegetarian: false
  },
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const [cartStore] = useState(() => createCartPersistence(AsyncStorage));
  // Static menu data and native image handles must not be serialized to storage.
  const [menuItems] = useState(() => initialMenuItems.map(item => ({
    ...item, image: require('../assets/snack-icon.png')
  })));

  const reportError = () => setCartError('Cart storage failed. Your last saved cart was retained. Retry, or explicitly reset it.');
  const retryCart = async () => {
    setIsLoading(true);
    try { await cartStore.load(); setCartError(null); }
    catch { reportError(); }
    finally { setIsLoading(false); }
  };
  useEffect(() => {
    let active = true;
    const unsubscribe = cartStore.subscribe(items => {
      if (active) setCartItems(items.map(item => ({
        ...item, image: require('../assets/snack-icon.png')
      })));
    });
    cartStore.load().then(() => { if (active) setCartError(null); })
      .catch(() => { if (active) reportError(); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; unsubscribe(); };
  }, [cartStore]);

  const mutate = change => cartStore.update(change)
    .then(() => setCartError(null))
    .catch(() => {
      reportError();
      Alert.alert('Cart not saved', 'The change could not be saved. Please retry.');
    });
  const addToCart = item => mutate(previous => addCartItem(previous, item));
  const removeFromCart = id => mutate(previous => removeCartItem(previous, id));
  const updateQuantity = (id, change) => mutate(previous => updateCartQuantity(previous, id, change));
  const clearCart = async () => {
    try { await cartStore.clear(); setCartError(null); }
    catch (error) { reportError(); throw error; }
  };

  // Function to get menu items with appropriate filters
  const getFilteredMenuItems = (categoryIds, filters) => {
    const { priceRange, dietaryPreference, ingredientsWith = [], ingredientsWithout = [] } = filters;
    
    // Filter by price range
    const getPriceFilter = (range) => {
      switch (range) {
        case 'Under Rs 100':
          return (price) => price < 100;
        case 'Rs 100 - 200':
          return (price) => price >= 100 && price <= 200;
        case 'Above Rs 200':
          return (price) => price > 200;
        default:
          return () => true;
      }
    };
    
    // Filter by dietary preference
    const getDietaryFilter = (preference) => {
      switch (preference) {
        case 'Vegetarian Only':
          return (item) => item.isVegetarian === true;
        case 'Non-Vegetarian':
          return (item) => item.isVegetarian === false;
        default:
          return () => true;
      }
    };
    
    return menuItems.filter((item) => {
      const matchesCategory = categoryIds.includes(item.categoryId);
      const priceMatch = getPriceFilter(priceRange)(item.price);
      const dietaryMatch = getDietaryFilter(dietaryPreference)(item);
      const excludesBadIngredients = ingredientsWithout.every(
        (badIng) => !item.ingredients.includes(badIng)
      );
      const includesRequiredIngredients =
        ingredientsWith.length === 0 || 
        ingredientsWith.every((requiredIng) => item.ingredients.includes(requiredIng));
        
      return (
        matchesCategory &&
        priceMatch &&
        dietaryMatch &&
        excludesBadIngredients &&
        includesRequiredIngredients
      );
    });
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        menuItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        cartError,
        retryCart,
        getFilteredMenuItems
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);