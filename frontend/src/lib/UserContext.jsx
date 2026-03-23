import { createContext, useContext, useState, useEffect } from 'react';
import { getTodayKey } from './utils';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  goals: [],
  habits: [],
  wantsMealPlans: true,
  activityLevel: 'lightly_active',
  sex: 'male',
  age: 25,
  country: 'US',
  heightFt: 5, heightIn: 9,
  heightCm: 175,
  currentWeight: 70,
  goalWeight: 65,
  goalPace: 1,
  unit: 'metric',
  healthConditions: [],
  onboarded: false,
};

const DEFAULT_LOG = { meals: [], exercises: [], water: 0 };

export function UserProvider({ children }) {
  const { user, isAuthLoading } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [dailyLog, setDailyLog] = useState(DEFAULT_LOG);
  const [weightHistory, setWeightHistory] = useState([]);
  
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. Reset to defaults if user logs out
  useEffect(() => {
    if (!user && !isAuthLoading) {
      setProfile(DEFAULT_PROFILE);
      setDailyLog(DEFAULT_LOG);
      setWeightHistory([]);
      setIsDataLoading(false);
    }
  }, [user, isAuthLoading]);

  // 2. Fetch/Sync Firestore data when user is authenticated
  useEffect(() => {
    if (!user) return;
    setIsDataLoading(true);

    const profileRef = doc(db, 'users', user.uid, 'profile', 'init');
    const logRef = doc(db, 'users', user.uid, 'dailyLogs', getTodayKey());

    // Fetch Profile
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(prev => ({ ...prev, ...data }));
          if (data.weightHistory) setWeightHistory(data.weightHistory);
        } else {
          // Initialize if missing
          await setDoc(profileRef, DEFAULT_PROFILE, { merge: true });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    // Fetch Daily Log
    const fetchLog = async () => {
      try {
        const snap = await getDoc(logRef);
        if (snap.exists()) {
          setDailyLog(snap.data());
        } else {
          await setDoc(logRef, DEFAULT_LOG);
        }
      } catch (err) {
        console.error("Error fetching daily log:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProfile().then(fetchLog);
  }, [user]);

  // --- Profile mutations ---
  const updateProfile = async (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'init'), updates, { merge: true });
    }
  };

  const setTargets = (newTargets) => {
    updateProfile({ targets: newTargets });
  };

  const logWeight = async (weight) => {
    const newHistory = [
      ...weightHistory.filter(w => w.date !== getTodayKey()),
      { date: getTodayKey(), weight }
    ];
    setWeightHistory(newHistory);
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'init'), { weightHistory: newHistory }, { merge: true });
    }
  };

  // --- Daily Log mutations ---
  const saveLog = async (newLog) => {
    setDailyLog(newLog);
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'dailyLogs', getTodayKey()), newLog, { merge: true });
    }
  };

  const addMeal = (food, grams = 100, mealType = 'snack') => {
    saveLog({
      ...dailyLog,
      meals: [...dailyLog.meals, { ...food, grams, mealType, id: Date.now() }],
    });
  };

  const removeMeal = (id) => {
    saveLog({
      ...dailyLog,
      meals: dailyLog.meals.filter(m => m.id !== id),
    });
  };

  const addExercise = (exercise) => {
    saveLog({
      ...dailyLog,
      exercises: [...dailyLog.exercises, { ...exercise, id: Date.now() }],
    });
  };

  const removeExercise = (id) => {
    saveLog({
      ...dailyLog,
      exercises: dailyLog.exercises.filter(e => e.id !== id),
    });
  };

  const addWater = (glasses = 1) => {
    saveLog({ ...dailyLog, water: dailyLog.water + glasses });
  };

  const resetDay = () => {
    saveLog(DEFAULT_LOG);
  };

  // --- Derived State ---
  const targets = profile.targets || { calories: 2000, protein: 150, carbs: 225, fat: 56 };

  const consumed = dailyLog.meals.reduce((acc, m) => {
    const multiplier = m.grams / 100;
    return {
      calories: acc.calories + (m.calories * multiplier),
      protein: acc.protein + (m.protein * multiplier),
      carbs: acc.carbs + (m.carbs * multiplier),
      fat: acc.fat + (m.fat * multiplier),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const exerciseCalories = dailyLog.exercises.reduce((sum, e) => sum + e.calories, 0);

  return (
    <UserContext.Provider value={{
      user, isAuthLoading: isAuthLoading || isDataLoading,
      profile, updateProfile, setTargets,
      dailyLog, addMeal, removeMeal, addExercise, removeExercise, addWater, resetDay,
      weightHistory, logWeight,
      targets, consumed, exerciseCalories,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
