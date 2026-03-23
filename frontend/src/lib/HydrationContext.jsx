import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const HydrationContext = createContext(null);

const DEFAULT_GOAL = 2500; // ml

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function HydrationProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({ goalMl: DEFAULT_GOAL, entries: [] });
  const [loading, setLoading] = useState(true);

  const todayKey = getTodayKey();

  useEffect(() => {
    if (!user) {
      setData({ goalMl: DEFAULT_GOAL, entries: [] });
      setLoading(false);
      return;
    }

    const fetchHydration = async () => {
      setLoading(true);
      try {
        const ref = doc(db, 'users', user.uid, 'hydration', todayKey);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data());
        } else {
          await setDoc(ref, { goalMl: DEFAULT_GOAL, entries: [] }, { merge: true });
        }
      } catch (err) {
        console.error("Error fetching hydration data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHydration();
  }, [user, todayKey]);

  // Save to Firestore
  const saveHydration = async (newData) => {
    setData(newData);
    if (user) {
      const ref = doc(db, 'users', user.uid, 'hydration', todayKey);
      await setDoc(ref, newData, { merge: true });
    }
  };

  const todayEntries = data.entries || [];
  const totalMl = todayEntries.reduce((sum, e) => sum + e.amount, 0);
  const progress = Math.min(totalMl / data.goalMl, 1);
  const percentage = Math.round(progress * 100);

  const addWater = useCallback((amountMl) => {
    const entry = {
      id: Date.now(),
      amount: amountMl,
      timestamp: new Date().toISOString(),
    };
    saveHydration({
      ...data,
      entries: [...todayEntries, entry],
    });
  }, [data, todayEntries]);

  const removeEntry = useCallback((entryId) => {
    saveHydration({
      ...data,
      entries: todayEntries.filter(e => e.id !== entryId),
    });
  }, [data, todayEntries]);

  const setGoal = useCallback((goalMl) => {
    saveHydration({
      ...data,
      goalMl: Math.max(250, goalMl),
    });
  }, [data]);

  const resetToday = useCallback(() => {
    saveHydration({
      ...data,
      entries: [],
    });
  }, [data]);

  return (
    <HydrationContext.Provider value={{
      goalMl: data.goalMl,
      todayEntries,
      totalMl,
      progress,
      percentage,
      addWater,
      removeEntry,
      setGoal,
      resetToday,
      loading
    }}>
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  const ctx = useContext(HydrationContext);
  if (!ctx) throw new Error('useHydration must be used within HydrationProvider');
  return ctx;
}
