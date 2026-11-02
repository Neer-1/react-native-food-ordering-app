const test = require('node:test');
const assert = require('node:assert/strict');
const { createDemoProfile, loadDemoState, saveDemoProfile, startDemoSession, endDemoSession } = require('../utils/demoProfile');
function memory(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { data, async getItem(k) { return data.get(k) ?? null; },
    async setItem(k,v) { data.set(k,v); }, async removeItem(k) { data.delete(k); },
    async multiRemove(keys) { keys.forEach(k => data.delete(k)); } };
}
test('alias produces a reserved synthetic address and rejects personal email input', () => {
  assert.deepEqual(createDemoProfile(' Demo_1 '), { username: 'Demo_1', email: 'demo_1@example.invalid' });
  for (const alias of ['', 'ab', 'a'.repeat(31), 'person@example.com', 'two names']) {
    assert.throws(() => createDemoProfile(alias));
  }
});
test('legacy credentials are removed and cannot resume a session', async () => {
  const storage = memory({ password: 'synthetic-test-secret', email: 'person@example.invalid', username: 'OldDemo', phone: '000', address: 'fixture', isLoggedIn: 'true', demoSession: 'true', unrelated: 'keep' });
  assert.deepEqual(await loadDemoState(storage), { profile: null, active: false });
  assert.deepEqual([...storage.data], [['unrelated', 'keep']]);
});
test('create, resume, logout, and continue preserve the same demo profile', async () => {
  const storage = memory();
  const profile = await saveDemoProfile(storage, 'Demo_1');
  assert.equal((await loadDemoState(storage)).active, false);
  await startDemoSession(storage, ' Demo_1 ');
  assert.deepEqual(await loadDemoState(storage), { profile, active: true });
  await endDemoSession(storage);
  assert.deepEqual(await loadDemoState(storage), { profile, active: false });
  await startDemoSession(storage, 'Demo_1');
  assert.equal((await loadDemoState(storage)).active, true);
});
test('renaming updates the synthetic email and rejects the old alias', async () => {
  const storage = memory();
  await saveDemoProfile(storage, 'Demo_1');
  await startDemoSession(storage, 'Demo_1');
  await saveDemoProfile(storage, 'Demo_2');
  await endDemoSession(storage);
  await assert.rejects(startDemoSession(storage, 'Demo_1'));
  assert.equal((await startDemoSession(storage, 'Demo_2')).email, 'demo_2@example.invalid');
});
test('corrupt profile or stale session fails closed', async () => {
  for (const raw of ['{', 'null', '{}', JSON.stringify({ username: 'Demo_1', email: 'other@example.invalid' })]) {
    const storage = memory({ 'foodies.demoProfile.v1': raw, 'foodies.demoSession.v1': 'true' });
    assert.deepEqual(await loadDemoState(storage), { profile: null, active: false });
  }
});
test('failed storage writes do not activate a session', async () => {
  const storage = memory();
  storage.setItem = async () => { throw new Error('storage full'); };
  await assert.rejects(saveDemoProfile(storage, 'Demo_1'), /storage full/);
  assert.equal((await loadDemoState(storage)).active, false);
});
test('failed migration propagates instead of silently resuming', async () => {
  const storage = memory();
  await saveDemoProfile(storage, 'Demo_1');
  storage.multiRemove = async () => { throw new Error('storage unavailable'); };
  await assert.rejects(loadDemoState(storage), /storage unavailable/);
});
