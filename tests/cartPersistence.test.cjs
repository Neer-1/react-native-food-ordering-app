const test = require('node:test');
const assert = require('node:assert/strict');
const { createCartPersistence } = require('../utils/cartPersistence');
const { addCartItem, updateCartQuantity } = require('../utils/cart');
const item = {id:'demo', name:'Synthetic item', price:12, ingredients:[], isVegetarian:true};
function memory(raw=null) { return {raw, writes:0, async getItem(){return this.raw;}, async setItem(key,value){this.writes++;this.raw=value;}}; }
test('restart restores saved quantities and totals, without serialised image handles', async()=>{
 const db=memory(); const first=createCartPersistence(db);
 await first.update(rows=>addCartItem(rows,{...item,image:42}));
 await first.update(rows=>updateCartQuantity(rows,item.id,2));
 const rows=await createCartPersistence(db).load();assert.equal(rows[0].quantity,3);assert.equal(rows[0].price*rows[0].quantity,36);assert.equal(rows[0].image,undefined);
});
test('missing and empty carts load without writing',async()=>{for(const raw of [null,'[]']){const db=memory(raw);assert.deepEqual(await createCartPersistence(db).load(),[]);assert.equal(db.writes,0);}});
test('invalid or corrupted data is retained until explicit reset',async()=>{
 for(const raw of ['{','null','{}','[null]',JSON.stringify([{...item,quantity:-1}])]){
 const db=memory(raw), store=createCartPersistence(db);await assert.rejects(store.load());await assert.rejects(store.update(rows=>addCartItem(rows,item)));assert.equal(db.raw,raw);assert.equal(db.writes,0);await store.clear();assert.deepEqual(await store.load(),[]);assert.equal(db.raw,'[]');}
});
test('read failure does not erase data and retry restores it',async()=>{const db=memory(JSON.stringify([{...item,quantity:2}]));const get=db.getItem;db.getItem=async()=>{throw Error('offline');};const store=createCartPersistence(db);await assert.rejects(store.load());assert.equal(db.writes,0);db.getItem=get;assert.equal((await store.load())[0].quantity,2);});
test('delayed write cannot overtake checkout clear; subsequent updates use empty state',async()=>{
 const db=memory();let release,started;const began=new Promise(r=>started=r);const set=db.setItem;let once=true;
 db.setItem=async function(k,v){if(once){once=false;started();await new Promise(r=>release=r);}await set.call(this,k,v);};
 const store=createCartPersistence(db);const adding=store.update(rows=>addCartItem(rows,item));await began;
 const clearing=store.clear();release();await Promise.all([adding,clearing]);assert.deepEqual(await createCartPersistence(db).load(),[]);
 await store.update(rows=>addCartItem(rows,item));assert.equal((await store.load())[0].quantity,1);
});
test('rapid quantity updates are serialized without lost increments',async()=>{const db=memory(),store=createCartPersistence(db);await store.update(rows=>addCartItem(rows,item));await Promise.all(Array.from({length:20},()=>store.update(rows=>updateCartQuantity(rows,item.id,1))));assert.equal((await createCartPersistence(db).load())[0].quantity,21);});
test('failed checkout retains state and surfaces failure; next clear can succeed',async()=>{const db=memory(JSON.stringify([{...item,quantity:1}])),store=createCartPersistence(db);await store.load();const set=db.setItem;db.setItem=async()=>{throw Error('full');};await assert.rejects(store.clear());assert.equal((await store.load()).length,1);db.setItem=set;await store.clear();assert.deepEqual(await store.load(),[]);});
test('state notifications follow successful persistence, not failed writes',async()=>{const db=memory(),store=createCartPersistence(db);const seen=[];store.subscribe(rows=>seen.push(rows));await store.load();db.setItem=async()=>{throw Error('full');};await assert.rejects(store.update(rows=>addCartItem(rows,item)));assert.equal(seen.length,1);assert.deepEqual(await store.load(),[]);});
test('aggregate overflow is rejected without storing invalid state',async()=>{const db=memory(),store=createCartPersistence(db);await assert.rejects(store.update(()=>[{...item,price:1e308,quantity:1},{...item,id:'two',price:1e308,quantity:1}]));assert.equal(db.writes,0);});
