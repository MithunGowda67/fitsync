import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num, decimals = 0) {
  return Number(num).toFixed(decimals);
}

export function calculateBMR(sex, weightKg, heightCm, age) {
  if (sex === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  }
  return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    'not_very_active': 1.2,
    'lightly_active': 1.375,
    'active': 1.55,
    'very_active': 1.725,
  };
  return bmr * (multipliers[activityLevel] || 1.2);
}

export function calculateMacros(tdee, goal) {
  let adjustedCalories = tdee;
  if (goal === 'lose_weight') adjustedCalories -= 500;
  if (goal === 'gain_weight' || goal === 'gain_muscle') adjustedCalories += 300;
  
  adjustedCalories = Math.max(adjustedCalories, 1200);
  
  let proteinPct, carbsPct, fatPct;
  
  if (goal === 'gain_muscle') {
    proteinPct = 0.35; carbsPct = 0.40; fatPct = 0.25;
  } else if (goal === 'lose_weight') {
    proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30;
  } else {
    proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;
  }
  
  return {
    calories: Math.round(adjustedCalories),
    protein: Math.round((adjustedCalories * proteinPct) / 4),
    carbs: Math.round((adjustedCalories * carbsPct) / 4),
    fat: Math.round((adjustedCalories * fatPct) / 9),
  };
}

export function lbsToKg(lbs) { return lbs * 0.453592; }
export function kgToLbs(kg) { return kg / 0.453592; }
export function ftInToCm(ft, inches) { return (ft * 30.48) + (inches * 2.54); }
export function cmToFtIn(cm) {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inches: Math.round(totalIn % 12) };
}

export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}
