import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const categories = [
  { id: '1', name: 'Burgers', image: require('../assets/icons/Burgers.png') },
  { id: '2', name: 'Fries & Sides', image: require('../assets/icons/Fries&Sides.png') },
  { id: '3', name: 'Pizzas', image: require('../assets/icons/Pizzas.png') },
  { id: '4', name: 'Wraps & Sandwiches', image: require('../assets/icons/Wraps&sanwiches.png') },
  { id: '5', name: 'Drinks', image: require('../assets/icons/Drinks.png') },
  { id: '6', name: 'Desserts', image: require('../assets/icons/Desserts.png') },
  { id: '7', name: 'Salads', image: require('../assets/icons/Salads.png') },
  { id: '8', name: 'Meal Combos', image: require('../assets/icons/MealCombos.png') },
];

const priceRanges = ['Any', 'Under Rs 100', 'Rs 100 - 200', 'Above Rs 200'];
const dietaryOptions = ['Any', 'Vegetarian Only', 'Non-Vegetarian'];

const ingredientsList = [
  'Grilled chicken breast', 'Spicy chicken patty', 'Vegetable patty', 'Paneer', 'Tofu',
  'Lettuce', 'Tomato', 'Pickles', 'Mayonnaise', 'Garlic sauce', 'JalapeÃ±os', 'Sriracha',
  'Onion rings', 'Green chutney', 'Cabbage slaw', 'Spicy sesame mayo', 'Pickled cucumber',
  'Potatoes', 'Sweet potatoes', 'Paprika', 'Mozzarella cheese', 'Cheese', 'Bell peppers',
  'Onions', 'Olives', 'Mushrooms', 'Sweetcorn', 'BBQ sauce', 'Pizza dough', 'Tomato sauce',
  'White sauce', 'Spinach', 'Tortilla wrap', 'Falafel balls', 'Tahini sauce', 'Cucumber', 'Hummus',
  'Eggs', 'Mustard', 'Black tea', 'Lemon', 'Ice', 'Milk', 'Ice cream',
  'Sugar', 'Apple slices', 'Carrots', 'Cream', 'Cocoa powder', 'Butter', 'Flour', 'Chocolate chips',
  'Biscuit base', 'Yeast', 'Croutons', 'Parmesan cheese', 'Romaine lettuce', 'Cherry tomatoes',
  'Quinoa', 'Chickpeas', 'Red onion', 'Olive oil', 'Vinaigrette', 'Burger bun', 
  'Fried tofu patty', 'Grilled paneer slices', 'Mint chutney', 'Shredded chicken',
  'Red onions', 'Tikka sauce', 'Green peppers', 'Grilled chicken strips', 'Yogurt sauce',
  'Capsicum', 'Pita bread', 'Bread slices', 'Boiled eggs', 'Carbonated water', 
  'Flavoring agents', 'Filtered drinking water', 'Vanilla/Chocolate/Strawberry flavoring',
  'Fresh fruits', 'Pie crust', 'Cinnamon', 'Cream cheese', 'Icing', 'Cooked quinoa',
  'Boiled chickpeas', 'Lemon juice', 'Ranch dressing', 'Caesar dressing', 'Spiral-cut potatoes',
  'Garlic powder', 'Salt', 'Vegetable oil', 'Onion slices', 'Cornstarch', 'Bread crumbs',
  'Spices', 'Italian seasoning', 'Fresh basil'
];

export default function HomeScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState('Any');
  const [dietaryPreference, setDietaryPreference] = useState('Any');
  const [withoutIngredients, setWithoutIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleWithoutIngredient = (ingredient) => {
    setWithoutIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const navigateToMenu = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('MenuDetail', {
        categoryIds: selectedCategories,
        filters: {
          priceRange,
          dietaryPreference,
          ingredientsWith: [],
          ingredientsWithout: withoutIngredients,
        },
      });
    }, 500);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedCategories.includes(item.id) && styles.selectedItem,
      ]}
      onPress={() => toggleCategory(item.id)}
    >
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.statusBarSpace} />
      <View style={styles.header}>
        <Text style={styles.appTitle}>Foodies</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter" size={24} color="#2e7d32" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Select Categories</Text>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.grid}
      />
      {selectedCategories.length > 0 && (
        <TouchableOpacity style={styles.goButton} onPress={navigateToMenu} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.goButtonText}>Go to Menu</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.filterTitle}>Filter By</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.filterContainer}>
              <Text style={styles.filterLabel}>Price Range:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={priceRange}
                  onValueChange={setPriceRange}
                  style={styles.picker}
                >
                  {priceRanges.map(range => (
                    <Picker.Item label={range} value={range} key={range} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Dietary Preference:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={dietaryPreference}
                  onValueChange={setDietaryPreference}
                  style={styles.picker}
                >
                  {dietaryOptions.map(option => (
                    <Picker.Item label={option} value={option} key={option} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Exclude Ingredients:</Text>
              <View style={styles.ingredientsContainer}>
                {ingredientsList.map(ingredient => (
                  <TouchableOpacity
                    key={ingredient}
                    onPress={() => toggleWithoutIngredient(ingredient)}
                    style={[
                      styles.ingredientOption,
                      withoutIngredients.includes(ingredient) && styles.selectedIngredientOption
                    ]}
                  >
                    <Text style={
                      withoutIngredients.includes(ingredient)
                        ? styles.selectedIngredient
                        : styles.ingredientText
                    }>
                      {ingredient}
                    </Text>
                    {withoutIngredients.includes(ingredient) && (
                      <Ionicons name="close-circle" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  statusBarSpace: { height: 40 }, // Added extra space below status bar (approximately 1cm)
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32' },
  filterButton: { flexDirection: 'row', alignItems: 'center' },
  filterButtonText: { marginLeft: 5, color: '#2e7d32', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 },
  grid: { padding: 10 },
  item: {
    flex: 1,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    padding: 15,
  },
  selectedItem: { backgroundColor: '#aed581' },
  image: { width: 50, height: 50, marginBottom: 10 },
  itemText: { textAlign: 'center' },
  goButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  goButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterTitle: { fontSize: 20, fontWeight: 'bold' },
  filterLabel: { marginTop: 10, fontWeight: 'bold' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 5 },
  picker: { height: 50, width: '100%' },
  filterContainer: { paddingBottom: 20 },
  ingredientsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  ingredientOption: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIngredientOption: { backgroundColor: '#4caf50' },
  ingredientText: { color: '#000' },
  selectedIngredient: { color: '#fff', marginRight: 6 },
  applyButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: { color: '#fff', fontWeight: 'bold' },
});