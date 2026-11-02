const test = require('node:test');
const assert = require('node:assert/strict');
const {
  addCartItem,
  removeCartItem,
  updateCartQuantity,
  calculateCartTotal,
} = require('../utils/cart');

test('adding a new item initializes quantity and dietary flag', () => {
  const result = addCartItem([], {
    id: 'item-1',
    price: 90,
    ingredients: ['Chicken breast'],
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 1);
  assert.equal(result[0].isVegetarian, false);
});

test('adding an existing item increments quantity without duplicating it', () => {
  const items = [{ id: 'item-1', price: 90, quantity: 2, isVegetarian: true }];
  const result = addCartItem(items, { id: 'item-1', price: 90 });

  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 3);
});

test('quantity decrement never drops below one', () => {
  const result = updateCartQuantity([{ id: 'item-1', quantity: 1 }], 'item-1', -1);

  assert.equal(result[0].quantity, 1);
});

test('removing an item leaves unrelated items unchanged', () => {
  const items = [{ id: 'item-1' }, { id: 'item-2' }];

  assert.deepEqual(removeCartItem(items, 'item-1'), [{ id: 'item-2' }]);
});

test('cart total multiplies each price by its quantity', () => {
  const items = [
    { id: 'item-1', price: 50, quantity: 2 },
    { id: 'item-2', price: 25, quantity: 3 },
  ];

  assert.equal(calculateCartTotal(items), 175);
});