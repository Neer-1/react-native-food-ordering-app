import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '../context/AppContext';

// Sample menu data with images and vegetarian status added
const menuItems = [
  {
    id: '1',
    name: 'Grilled Chicken Burger',
    categoryId: '1',
    price: 150,
    ingredients: ['Grilled chicken breast', 'Lettuce', 'Tomato', 'Garlic sauce'],
    image: require('../assets/Burgers/GrilledChickenBurger.jpg'),
    description: 'Juicy grilled chicken with fresh vegetables and our special garlic sauce.',
    isVegetarian: false
  },
  {
    id: '2',
    name: 'Veggie Delight Burger',
    categoryId: '1',
    price: 90,
    ingredients: ['Vegetable patty', 'Lettuce', 'Tomato', 'Mayonnaise'],
    image: require('../assets/Burgers/VeggieDelightBurger.jpg'),
    description: 'Plant-based patty with crisp fresh vegetables and creamy mayo.',
    isVegetarian: true
  },
  {
    id: '3',
    name: 'Paneer Wrap',
    categoryId: '4',
    price: 130,
    ingredients: ['Paneer', 'Lettuce', 'Green chutney', 'Tortilla wrap'],
    image: require('../assets/wrap/PaneerWrap.jpeg'),
    description: 'Fresh paneer with crisp lettuce and zesty green chutney in a soft tortilla.',
    isVegetarian: true
  },
  {
    id: '4',
    name: 'Mushroom Pizza',
    categoryId: '3',
    price: 210,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mushrooms', 'Cheese'],
    image: require('../assets/pizzas/MushroomPizza.jpg'),
    description: 'Thin crust pizza topped with sautÃ©ed mushrooms and melted cheese.',
    isVegetarian: true
  },
  {
    id: '5',
    name: 'Sweetcorn Salad',
    categoryId: '7',
    price: 80,
    ingredients: ['Sweetcorn', 'Lettuce', 'Vinaigrette', 'Cherry tomatoes'],
    image: require('../assets/salad/sweetcornsalad.jpeg'),
    description: 'Fresh and healthy salad with sweet corn kernels and tangy vinaigrette.',
    isVegetarian: true
  },
  {
    id: '6',
    name: 'French Fries',
    categoryId: '2',
    price: 60,
    ingredients: ['Potatoes', 'Salt'],
    image: require('../assets/sides/FrenchFries.jpg'),
    description: 'Crispy golden fries seasoned with salt.',
    isVegetarian: true
  },
  {
    id: '7',
    name: 'Iced Tea',
    categoryId: '5',
    price: 40,
    ingredients: ['Black tea', 'Ice', 'Lemon', 'Sugar'],
    image: require('../assets/drinks/icetea.jpg'),
    description: 'Refreshing iced tea with a hint of lemon.',
    isVegetarian: true
  },
  {
    id: '8',
    name: 'Chocolate Brownie',
    categoryId: '6',
    price: 70,
    ingredients: ['Flour', 'Cocoa powder', 'Chocolate chips', 'Butter', 'Sugar', 'Eggs'],
    image: require('../assets/desserts/chocolatebrownie.jpg'),
    description: 'Rich chocolate brownie with chocolate chips.',
    isVegetarian: false
  },
 
  {
    id: '10',
    name: 'Spicy Chicken Wrap',
    categoryId: '4',
    price: 140,
    ingredients: ['Spicy chicken patty', 'Lettuce', 'Sriracha', 'Mayonnaise', 'Tortilla wrap'],
    image: require('../assets/wrap/spicychickenwrap.jpeg'),
    description: 'Spicy chicken with fresh veggies and sriracha sauce in a tortilla wrap.',
    isVegetarian: false
  },
  {
    id: '11',
    name: 'Chicken Burger Combo',
    categoryId: '8',
    price: 225,
    ingredients: ['Grilled chicken breast', 'Lettuce', 'Tomato', 'Garlic sauce', 'Potatoes', 'Salt', 'Black tea', 'Ice', 'Lemon', 'Sugar'],
    image: require('../assets/combo/chickenburgercombo.jpeg'),
    description: 'Grilled chicken burger served with classic fries and a refreshing soft drink â€” a satisfying combo for any meal.',
    isVegetarian: false
  },
  // New burgers
  {
    id: '12',
    name: 'Spicy Chicken Burger',
    categoryId: '1',
    price: 160,
    ingredients: ['Burger bun', 'Fried spicy chicken patty', 'Lettuce', 'JalapeÃ±os', 'Spicy mayo'],
    image: require('../assets/Burgers/SpicyChickenBurger.jpg'),
    description: 'Fiery fried chicken patty with crisp lettuce and jalapeÃ±os, topped with spicy mayo for a kick.',
    isVegetarian: false
  },
  {
    id: '13',
    name: 'Paneer Tikka Burger',
    categoryId: '1',
    price: 140,
    ingredients: ['Burger bun', 'Grilled paneer slices', 'Onion rings', 'Green chutney', 'Lettuce'],
    image: require('../assets/Burgers/PaneerTikkaBurger.jpg'),
    description: 'Delicately spiced grilled paneer with crispy onion rings and mint chutney in a soft bun.',
    isVegetarian: true
  },
  {
    id: '14',
    name: 'Crispy Tofu Burger',
    categoryId: '1',
    price: 130,
    ingredients: ['Burger bun', 'Fried tofu patty', 'Cabbage slaw', 'Spicy sesame mayo', 'Pickled cucumber'],
    image: require('../assets/Burgers/CrispyTofuBurger.jpg'),
    description: 'Crunchy tofu patty with fresh cabbage slaw and tangy pickled cucumber in sesame mayo.',
    isVegetarian: true
  },
  // Fries & Sides
  {
    id: '15',
    name: 'Curly Fries',
    categoryId: '2',
    price: 75,
    ingredients: ['Spiral-cut potatoes', 'Paprika', 'Garlic powder', 'Salt', 'Vegetable oil'],
    image: require('../assets/sides/CurlyFries.jpg'),
    description: 'Perfectly seasoned spiral-cut potatoes fried until golden and crispy.',
    isVegetarian: true
  },
  {
    id: '16',
    name: 'Onion Rings',
    categoryId: '2',
    price: 65,
    ingredients: ['Onion slices', 'Flour', 'Cornstarch', 'Bread crumbs', 'Spices'],
    image: require('../assets/sides/OnionRings.jpg'),
    description: 'Crispy golden rings of onion coated in a seasoned batter and fried to perfection.',
    isVegetarian: true
  },
  {
    id: '17',
    name: 'Mozzarella Sticks',
    categoryId: '2',
    price: 85,
    ingredients: ['Mozzarella cheese', 'Flour', 'Egg', 'Bread crumbs', 'Italian seasoning'],
    image: require('../assets/sides/MozzarellaSticks.jpg'),
    description: 'Gooey mozzarella cheese coated in crispy Italian-seasoned breadcrumbs, served hot and melty.',
    isVegetarian: true
  },
  {
    id: '18',
    name: 'Sweet Potato Fries',
    categoryId: '2',
    price: 80,
    ingredients: ['Sweet potatoes', 'Olive oil', 'Salt', 'Paprika'],
    image: require('../assets/sides/SweetPotatoFries.jpg'),
    description: 'Crispy on the outside, soft on the inside sweet potato fries with a hint of paprika.',
    isVegetarian: true
  },
  // Pizzas
  {
    id: '19',
    name: 'Margherita Pizza',
    categoryId: '3',
    price: 190,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil'],
    image: require('../assets/pizzas/MargheritaPizza.jpg'),
    description: 'Classic Italian pizza with tangy tomato sauce, melted mozzarella, and fresh aromatic basil.',
    isVegetarian: true
  },
  {
    id: '20',
    name: 'Veggie Supreme Pizza',
    categoryId: '3',
    price: 220,
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Bell peppers', 'Onions', 'Olives', 'Mushrooms', 'Sweetcorn'],
    image: require('../assets/pizzas/VeggieSupremePizza.jpg'),
    description: 'Loaded with colorful vegetables on a rich tomato base, topped with melted mozzarella cheese.',
    isVegetarian: true
  },
  {
    id: '21',
    name: 'BBQ Chicken Pizza',
    categoryId: '3',
    price: 240,
    ingredients: ['Pizza dough', 'BBQ sauce', 'Shredded chicken', 'Mozzarella cheese', 'Red onions'],
    image: require('../assets/pizzas/ChickenBBQPizza.jpg'),
    description: 'Smoky BBQ sauce and tender chicken pieces with red onions and melted cheese on a thin crust.',
    isVegetarian: false
  },
  {
    id: '22',
    name: 'Paneer Pizza',
    categoryId: '3',
    price: 230,
    ingredients: ['Pizza dough', 'Tikka sauce', 'Grilled paneer cubes', 'Onions', 'Green peppers', 'Mozzarella cheese'],
    image: require('../assets/pizzas/PaneerPizza.jpg'),
    description: 'Indian-inspired pizza with spiced paneer cubes, bell peppers and onions on a tikka sauce base.',
    isVegetarian: true
  },
  {
    id: '23',
    name: 'Mushroom & Spinach Pizza',
    categoryId: '3',
    price: 215,
    ingredients: ['Pizza dough', 'White sauce', 'SautÃ©ed mushrooms', 'Fresh spinach', 'Mozzarella cheese'],
    image: require('../assets/pizzas/MushroomSpinachPizza.jpg'),
    description: 'Creamy white sauce base topped with earthy mushrooms and fresh spinach leaves.',
    isVegetarian: true
  },
  // Wraps & Sandwiches
  {
    id: '24',
    name: 'Grilled Chicken Wrap',
    categoryId: '4',
    price: 135,
    ingredients: ['Tortilla wrap', 'Grilled chicken strips', 'Lettuce', 'Tomato', 'Yogurt sauce'],
    image: require('../assets/wrap/grilledchickenwrap.jpeg'),
    description: 'Succulent grilled chicken with fresh vegetables and creamy yogurt sauce in a soft tortilla.',
    isVegetarian: false
  },
  {
    id: '25',
    name: 'Spicy Paneer Wrap',
    categoryId: '4',
    price: 125,
    ingredients: ['Tortilla wrap', 'Spicy grilled paneer', 'Onion', 'Capsicum', 'Mint chutney'],
    image: require('../assets/wrap/SpicyPaneerWrap.jpeg'),
    description: 'Spicy marinated paneer with sautÃ©ed veggies and cooling mint chutney wrapped in a tortilla.',
    isVegetarian: true
  },

  {
    id: '27',
    name: 'Veggie Sandwich',
    categoryId: '4',
    price: 100,
    ingredients: ['Bread slices', 'Lettuce', 'Tomato', 'Cucumber', 'Cheese', 'Hummus'],
    image: require('../assets/wrap/veggiesandwich.jpeg'),
    description: 'Fresh vegetables and creamy hummus between slices of bread for a light, nutritious meal.',
    isVegetarian: true
  },
  {
    id: '28',
    name: 'Egg Salad Sandwich',
    categoryId: '4',
    price: 110,
    ingredients: ['Bread slices', 'Boiled eggs', 'Mayo', 'Mustard', 'Lettuce'],
    image: require('../assets/wrap/eggsaladsandwich.jpeg'),
    description: 'Creamy egg salad with a hint of mustard on fresh bread with crisp lettuce.',
    isVegetarian: false
  },
  // Drinks
  {
    id: '29',
    name: 'Soft Drinks',
    categoryId: '5',
    price: 35,
    ingredients: ['Carbonated water', 'Sugar', 'Flavoring agents'],
    image: require('../assets/drinks/softdrinks.jpg'),
    description: 'Refreshing carbonated soft drinks in various flavors.',
    isVegetarian: true
  },
  {
    id: '30',
    name: 'Bottled Water',
    categoryId: '5',
    price: 25,
    ingredients: ['Filtered drinking water'],
    image: require('../assets/drinks/water.jpg'),
    description: 'Pure and refreshing bottled water.',
    isVegetarian: true
  },
  {
    id: '31',
    name: 'Milkshake',
    categoryId: '5',
    price: 80,
    ingredients: ['Milk', 'Ice cream', 'Vanilla/Chocolate/Strawberry flavoring', 'Sugar'],
    image: require('../assets/drinks/milkshake.jpg'),
    description: 'Creamy, thick milkshake available in classic flavors.',
    isVegetarian: true
  },
  {
    id: '32',
    name: 'Fresh Juice',
    categoryId: '5',
    price: 60,
    ingredients: ['Fresh fruits', 'Ice'],
    image: require('../assets/drinks/juice.jpg'),
    description: 'Freshly squeezed fruit juice served chilled over ice.',
    isVegetarian: true
  },
  // Desserts
  {
    id: '33',
    name: 'Ice Cream',
    categoryId: '6',
    price: 50,
    ingredients: ['Milk', 'Cream', 'Sugar', 'Flavoring'],
    image: require('../assets/desserts/icecream.jpg'),
    description: 'Creamy frozen dessert available in various flavors.',
    isVegetarian: true
  },
  {
    id: '34',
    name: 'Apple Pie',
    categoryId: '6',
    price: 75,
    ingredients: ['Pie crust', 'Apple slices', 'Sugar', 'Cinnamon'],
    image: require('../assets/desserts/applepie.jpeg'),
    description: 'Warm apple pie with a hint of cinnamon in a flaky buttery crust.',
    isVegetarian: true
  },
  {
    id: '35',
    name: 'Cheesecake',
    categoryId: '6',
    price: 85,
    ingredients: ['Cream cheese', 'Sugar', 'Eggs', 'Biscuit base'],
    image: require('../assets/desserts/cheesecake.jpg'),
    description: 'Rich and creamy cheesecake on a crunchy biscuit base.',
    isVegetarian: false
  },
  {
    id: '36',
    name: 'Donuts',
    categoryId: '6',
    price: 45,
    ingredients: ['Flour', 'Sugar', 'Milk', 'Yeast', 'Icing'],
    image: require('../assets/desserts/donut.jpg'),
    description: 'Light and fluffy donuts with a sweet glaze.',
    isVegetarian: true
  },
  // Salads
  {
    id: '37',
    name: 'Garden Salad',
    categoryId: '7',
    price: 70,
    ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Carrots', 'Olive oil', 'Vinaigrette'],
    image: require('../assets/salad/gardensalad.jpg'),
    description: 'Fresh garden vegetables tossed in a light vinaigrette dressing.',
    isVegetarian: true
  },
  {
    id: '38',
    name: 'Caesar Salad',
    categoryId: '7',
    price: 90,
    ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan cheese', 'Caesar dressing'],
    image: require('../assets/salad/caesarsalad.jpg'),
    description: 'Classic Caesar salad with crunchy croutons and parmesan cheese.',
    isVegetarian: true
  },
  {
    id: '39',
    name: 'Grilled Chicken Salad',
    categoryId: '7',
    price: 120,
    ingredients: ['Lettuce', 'Grilled chicken strips', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Ranch dressing'],
    image: require('../assets/salad/grilledchickensalad.jpg'),
    description: 'Nutritious mix of fresh vegetables topped with tender grilled chicken strips.',
    isVegetarian: false
  },
  {
    id: '40',
    name: 'Chickpea & Quinoa Salad',
    categoryId: '7',
    price: 110,
    ingredients: ['Cooked quinoa', 'Boiled chickpeas', 'Red onion', 'Cucumber', 'Lemon juice', 'Olive oil'],
    image: require('../assets/salad/chickpeaquinoasalad.jpeg'),
    description: 'Protein-packed quinoa and chickpeas with fresh vegetables in a zesty lemon dressing.',
    isVegetarian: true
  },
  // Additional Combo Meals
  {
    id: '41',
    name: 'Veggie Burger Combo',
    categoryId: '8',
    price: 180,
    ingredients: ['Vegetable patty', 'Lettuce', 'Tomato', 'Mayonnaise', 'Sweet potatoes', 'Olive oil', 'Salt', 'Paprika', 'Fresh fruits', 'Ice'],
    image: require('../assets/combo/veggieburgercombo.jpeg'),
    description: 'Delicious veggie burger served with sweet potato fries and a refreshing fresh fruit juice.',
    isVegetarian: true
  },
  {
    id: '42',
    name: 'Paneer Wrap Combo',
    categoryId: '8',
    price: 195,
    ingredients: ['Tortilla wrap', 'Spicy grilled paneer', 'Onion', 'Capsicum', 'Mint chutney', 'potatoes', 'Paprika', 'Garlic powder', 'Salt', 'Milk', 'Ice cream', 'Vanilla flavoring'],
    image: require('../assets/combo/Spicypaneerwrapcombo.jpeg'),
    description: 'Spicy paneer wrap with french fries and a creamy vanilla milkshake for a satisfying meal.',
    isVegetarian: true
  },
  {
    id: '43',
    name: 'Grilled Chicken Wrap Combo',
    categoryId: '8',
    price: 210,
    ingredients: ['Tortilla wrap', 'Grilled chicken strips', 'Lettuce', 'Tomato', 'Yogurt sauce', 'Onion slices', 'Flour', 'Cornstarch', 'Bread crumbs', 'Carbonated water', 'Sugar', 'Flavoring agents'],
    image: require('../assets/combo/grilledchickenwrapcombo.jpeg'),
    description: 'Tasty grilled chicken wrap with crispy onion rings and your choice of soft drink.',
    isVegetarian: false
  }
];

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

export default function MenuDetailScreen({ route, navigation }) {
  const { categoryIds, filters } = route.params;
  const { priceRange, dietaryPreference, ingredientsWith = [], ingredientsWithout = [] } = filters;
  const { addToCart } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);

  // Apply filters
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const items = menuItems.filter((item) => {
        const matchesCategory = categoryIds.includes(item.categoryId);
        const priceMatch = getPriceFilter(priceRange)(item.price);
        const dietaryMatch = getDietaryFilter(dietaryPreference)(item);
        const excludesBadIngredients = ingredientsWithout.every(
          (badIng) => !item.ingredients.includes(badIng)
        );
        const includesRequiredIngredients =
          ingredientsWith.length === 0 || ingredientsWith.every((requiredIng) =>
            item.ingredients.includes(requiredIng)
          );

        return (
          matchesCategory &&
          priceMatch &&
          dietaryMatch &&
          excludesBadIngredients &&
          includesRequiredIngredients
        );
      });
      setFilteredItems(items);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [categoryIds, priceRange, dietaryPreference, ingredientsWith, ingredientsWithout]);

  // Add item to cart using global context
  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert(
      'Added to Cart',
      `${item.name} has been added to your cart.`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'Go to Cart',
          onPress: () => navigation.navigate('Main', { screen: 'CartTab' }),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <View style={styles.itemNameContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.isVegetarian ? (
              <View style={styles.vegBadge}>
                <Text style={styles.vegText}>VEG</Text>
              </View>
            ) : (
              <View style={styles.nonVegBadge}>
                <Text style={styles.vegText}>NON-VEG</Text>
              </View>
            )}
          </View>
          <Text style={styles.price}>Rs {item.price}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.ingredients}>
        Ingredients: {item.ingredients.join(', ')}
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Filtered Menu</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={60} color="#888" />
          <Text style={styles.noItemsText}>No items match your filters.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 24,
    color: '#555',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2e7d32',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#fff',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
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
  price: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
