import { doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Reads data from localStorage.
 */
function getLocalItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

/**
 * Migrates local storage data to Cloud Firestore for a newly authenticated user.
 * 
 * Data points migrated:
 * - Profile targets and history ('fitsync_profile')
 * - Weight History ('fitsync_weight_history')
 * - Hydration Data ('fitsync_hydration')
 * - Daily Logs (Searches localStorage for keys matching `fitsync_log_YYYY-MM-DD`)
 */
export async function migrateDataToCloud(uid) {
  try {
    const batch = writeBatch(db);
    let modifications = 0;

    // 1. Profile
    const profile = getLocalItem('fitsync_profile');
    const weightHistory = getLocalItem('fitsync_weight_history');
    
    if (profile || weightHistory) {
      const profileData = { ...(profile || {}) };
      if (weightHistory) {
        profileData.weightHistory = weightHistory;
      }
      const profileRef = doc(db, 'users', uid, 'profile', 'init');
      batch.set(profileRef, profileData, { merge: true });
      modifications++;
    }

    // 2. Hydration
    const hydration = getLocalItem('fitsync_hydration');
    if (hydration && hydration.days) {
      const goalMl = hydration.goalMl || 2500;
      for (const [dateKey, entries] of Object.entries(hydration.days)) {
        const hydRef = doc(db, 'users', uid, 'hydration', dateKey);
        batch.set(hydRef, { goalMl, entries }, { merge: true });
        modifications++;
      }
    }

    // 3. Daily Logs
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fitsync_log_')) {
          const dateKey = key.replace('fitsync_log_', '');
          const logData = getLocalItem(key);
          if (logData) {
            const logRef = doc(db, 'users', uid, 'dailyLogs', dateKey);
            batch.set(logRef, logData, { merge: true });
            modifications++;
          }
        }
    }

    // If nothing to migrate, return early
    if (modifications === 0) return true;

    // Execute the Batch Write
    await batch.commit();
    console.log(`Successfully migrated ${modifications} documents to Firestore for user ${uid}.`);

    // ONLY clear localStorage if the commit succeeds
    localStorage.removeItem('fitsync_profile');
    localStorage.removeItem('fitsync_weight_history');
    localStorage.removeItem('fitsync_hydration');
    
    // Clear all daily logs in local storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fitsync_log_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    return true;

  } catch (err) {
    console.error("Migration failed:", err);
    throw err; 
    // Do NOT clear localStorage if batch.commit() crashes.
  }
}
