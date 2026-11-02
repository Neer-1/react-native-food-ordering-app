const test = require('node:test');
const assert = require('node:assert/strict');
const { decodeStoredCart, calculateCartTotal } = require('../utils/cart');
const row = { id: '1', name: 'Synthetic item', price: 12.5, quantity: 2, ingredients: ['Demo'], isVegetarian: true };
test('valid saved cart restores totals and strips serialized images/extra fields', () => {
 const result = decodeStoredCart(JSON.stringify([{...row, image: 123, privateNote: 'discard'}]));
 assert.equal(calculateCartTotal(result), 25);
 assert.deepEqual(result, [row]);
});
test('missing and empty carts restore empty', () => {
 assert.deepEqual(decodeStoredCart(null), []); assert.deepEqual(decodeStoredCart('[]'), []);
});
test('invalid JSON, containers and rows are rejected', () => {
 for (const raw of ['{', 'null', '{}', '[null]', '[1]']) assert.throws(() => decodeStoredCart(raw));
});
test('invalid prices, quantities, flags and ingredients are rejected', () => {
 for (const patch of [{price: -1}, {price: '12'}, {price: null}, {quantity: 0}, {quantity: -1}, {quantity: 1.5}, {quantity: Number.MAX_SAFE_INTEGER+1}, {isVegetarian: 'yes'}, {ingredients: [null]}, {id: ''}, {name: null}])
   assert.throws(() => decodeStoredCart(JSON.stringify([{...row, ...patch}])));
 assert.throws(() => decodeStoredCart('[{"id":"1","name":"Demo","price":1e309,"quantity":1}]'));
});
test('duplicate keys and overflow totals are rejected', () => {
 assert.throws(() => decodeStoredCart(JSON.stringify([row,row])));
 assert.throws(() => decodeStoredCart(JSON.stringify([{...row,price:1e308,quantity:10}])));
});
