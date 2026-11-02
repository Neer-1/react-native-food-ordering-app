function createDemoProfile(username) {
  const displayName = String(username || '').trim();
  if (!/^[A-Za-z0-9_-]{3,30}$/.test(displayName)) {
    throw new Error('Use 3-30 letters, numbers, underscores, or hyphens.');
  }

  return {
    username: displayName,
    email: `${displayName.toLowerCase()}@example.invalid`,
  };
}

// Versioned storage contains only a demo alias and its synthetic email.
const PROFILE_KEY = 'foodies.demoProfile.v1';
const SESSION_KEY = 'foodies.demoSession.v1';
const LEGACY_KEYS = ['password', 'isLoggedIn', 'email', 'phone', 'address', 'username', 'demoSession'];

async function loadDemoState(storage) {
  await storage.multiRemove(LEGACY_KEYS);
  const raw = await storage.getItem(PROFILE_KEY);
  let profile = null;
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      const normalized = createDemoProfile(saved.username);
      if (saved.email === normalized.email) profile = normalized;
    } catch (_) {
      // Invalid local data cannot resume a demo session.
    }
  }
  if (!profile) {
    await storage.multiRemove([PROFILE_KEY, SESSION_KEY]);
    return { profile: null, active: false };
  }
  return { profile, active: (await storage.getItem(SESSION_KEY)) === 'true' };
}

async function saveDemoProfile(storage, username) {
  const profile = createDemoProfile(username);
  await storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

async function startDemoSession(storage, username) {
  const { profile } = await loadDemoState(storage);
  if (!profile || profile.username !== username.trim()) {
    throw new Error('No matching local demo alias was found.');
  }
  await storage.setItem(SESSION_KEY, 'true');
  return profile;
}

async function endDemoSession(storage) {
  await storage.removeItem(SESSION_KEY);
  await storage.multiRemove(LEGACY_KEYS);
}

module.exports = { createDemoProfile, loadDemoState, saveDemoProfile, startDemoSession, endDemoSession };
