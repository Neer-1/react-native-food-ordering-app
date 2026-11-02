function withDietaryFlag(item) {

  if (item.isVegetarian !== undefined) {

    return item;

  }



  const nonVegetarianIngredients = ['chicken', 'eggs'];

  const containsNonVegetarianIngredient = (item.ingredients || []).some((ingredient) =>

    nonVegetarianIngredients.some((name) => ingredient.toLowerCase().includes(name))

  );



  return { ...item, isVegetarian: !containsNonVegetarianIngredient };

}



function addCartItem(cartItems, item) {

  const existing = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existing) {

    return cartItems.map((cartItem) =>

      cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem

    );

  }



  return [...cartItems, { ...withDietaryFlag(item), quantity: 1 }];

}



function removeCartItem(cartItems, itemId) {

  return cartItems.filter((item) => item.id !== itemId);

}



function updateCartQuantity(cartItems, itemId, change) {

  return cartItems.map((item) =>

    item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item

  );

}



function calculateCartTotal(cartItems) {

  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

}



module.exports = { addCartItem, removeCartItem, updateCartQuantity, calculateCartTotal };
// Persisted local data is untrusted; reject malformed rows before rendering/totalling.
function decodeStoredCart(raw) {
  if (raw === null) return [];
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Invalid saved cart');
  const ids = new Set();
  let total = 0;
  return rows.map((item) => {
    if (!item || typeof item !== 'object' ||
        typeof item.id !== 'string' || !item.id || ids.has(item.id) ||
        typeof item.name !== 'string' || !item.name ||
        !Number.isFinite(item.price) || item.price < 0 ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
        !Number.isFinite(item.price * item.quantity) ||
        (item.isVegetarian !== undefined && typeof item.isVegetarian !== 'boolean') ||
        (item.ingredients !== undefined && (!Array.isArray(item.ingredients) ||
          !item.ingredients.every((value) => typeof value === 'string')))) {
      throw new Error('Invalid saved cart');
    }
    total += item.price * item.quantity;
    if (!Number.isFinite(total)) throw new Error('Invalid saved cart total');
    ids.add(item.id);
    return { id: item.id, name: item.name, price: item.price, quantity: item.quantity,
      ...(item.isVegetarian === undefined ? {} : { isVegetarian: item.isVegetarian }),
      ingredients: item.ingredients || [] };
  });
}
module.exports.decodeStoredCart = decodeStoredCart;
