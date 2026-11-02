const { decodeStoredCart } = require('./cart');

// One queue owns reads, writes and checkout clears. Publish only durable state.
function createCartPersistence(storage) {
  let items = [], ready = false, tail = Promise.resolve();
  const listeners = new Set();
  const publish = () => listeners.forEach(fn => fn(items));
  function enqueue(operation) {
    const result = tail.then(operation);
    tail = result.catch(() => {}); // A failed operation must not poison retries.
    return result;
  }
  async function restore() {
    if (!ready) {
      const restored = decodeStoredCart(await storage.getItem('cartItems'));
      items = restored; ready = true; publish();
    }
    return items;
  }
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    load() { return enqueue(restore); },
    update(change) {
      return enqueue(async () => {
        await restore();
        const next = decodeStoredCart(JSON.stringify(change(items)));
        await storage.setItem('cartItems', JSON.stringify(next));
        items = next; publish(); return items;
      });
    },
    // Also provides explicit user-confirmed recovery from corrupt/unreadable data.
    clear() {
      return enqueue(async () => {
        await storage.setItem('cartItems', '[]');
        items = []; ready = true; publish(); return items;
      });
    }
  };
}
module.exports = { createCartPersistence };
